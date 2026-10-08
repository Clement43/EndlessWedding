import { Controller } from './Controller';
import { Draw } from './Draw/Draw';
import { DrawnLandscape } from './Draw/DrawnLandscape';
import { DrawObject } from './Draw/DrawObject';
import { DrawObstacle } from './Draw/DrawObstacle';
import { Physics } from './Physics';
import { Player } from './Player';
import archUrl from '../asset/arche.png';
import cakeUrl from '../asset/cake.png';
import groundUrl from '../asset/Ground.png';
import shadowUrl from '../asset/shadow.png';
import cloudOneUrl from '../asset/cloud1.png';
import cloudTwoUrl from '../asset/cloud2.png';
import cloudThreeUrl from '../asset/cloud3.png';

export type GameState = 'ready' | 'running' | 'paused' | 'over';
export type GameSnapshot = { state: GameState; score: number; best: number };

export function getCloudLayout(canvasWidth: number, travel: number) {
    const profiles = [
        { width: 88, top: 12 },
        { width: 98, top: 78 },
        { width: 74, top: 40 },
        { width: 96, top: 108 },
        { width: 66, top: 56 },
    ];
    const loopWidth = canvasWidth + 200;
    const spacing = loopWidth / profiles.length;
    return profiles.map((profile, index) => ({
        ...profile,
        left: ((index * spacing - travel) % loopWidth + loopWidth) % loopWidth - 100,
        sprite: index % 3,
    }));
}

export class Game {
    private readonly draw = new Draw();
    private readonly ground = new DrawnLandscape(groundUrl);
    private readonly background = new DrawnLandscape(shadowUrl);
    private readonly arch = new DrawObject(archUrl, true);
    private readonly cake = new DrawObject(cakeUrl);
    private readonly clouds = [cloudOneUrl, cloudTwoUrl, cloudThreeUrl].map(url => new DrawObject(url));
    private readonly physics = new Physics();
    private readonly players = [
        new Player(128, 338, 'groom'),
        new Player(184, 338, 'bride'),
    ];
    private readonly controller: Controller;
    private readonly observer: ResizeObserver;
    private readonly onChange: (snapshot: GameSnapshot) => void;
    private readonly abort = new AbortController();
    private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    private state: GameState = 'ready';
    private obstacles: DrawObstacle[] = [];
    private followerJumpDistance: number | null = null;
    private distance = 0;
    private elapsed = 0;
    private ambientTime = 0;
    private spawnTimer = 0.65;
    private best = 0;
    private lastScore = -1;
    private previousTime = 0;
    private frame = 0;

    constructor(onChange: (snapshot: GameSnapshot) => void) {
        this.onChange = onChange;
        try {
            const stored = Number(localStorage.getItem('wedding-runner-best'));
            if (Number.isFinite(stored) && stored > 0) this.best = Math.floor(stored);
        } catch {}
        const canvas = this.draw.getCanvas();
        this.controller = new Controller(canvas, () => this.jump(), () => this.togglePause());
        this.observer = new ResizeObserver(() => {
            const width = window.matchMedia('(max-width: 760px)').matches ? 600 : 960;
            if (canvas.width === width) return;
            this.pause();
            canvas.width = width;
            const startX = width === 600 ? 78 : 128;
            this.players.forEach((player, index) => player.setX(startX + index * 56));
        });
        this.observer.observe(canvas);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.pause();
        }, { signal: this.abort.signal });
        window.addEventListener('blur', () => this.pause(), { signal: this.abort.signal });
        this.notify();
        this.frame = requestAnimationFrame(this.loop);
    }

    public start(): void {
        this.obstacles = [];
        this.followerJumpDistance = null;
        this.distance = 0;
        this.elapsed = 0;
        this.spawnTimer = 0.65;
        this.previousTime = 0;
        this.ground.reset();
        this.background.reset();
        for (const player of this.players) {
            player.setY(this.groundY - player.getHeight());
            player.setVelocityY(0);
            player.setIsJumping(false);
        }
        this.state = 'running';
        this.notify();
        this.draw.getCanvas().focus({ preventScroll: true });
    }

    public jump(): void {
        const [follower, leader] = this.players;
        if (this.state !== 'running' || leader.getIsJumping()) return;
        leader.setVelocityY(-580);
        leader.setIsJumping(true);
        this.followerJumpDistance = this.distance + leader.getX() - follower.getX();
    }

    public togglePause(): void {
        if (this.state === 'running') this.pause();
        else if (this.state === 'paused') {
            this.state = 'running';
            this.previousTime = 0;
            this.notify();
            this.draw.getCanvas().focus({ preventScroll: true });
        }
    }

    public destroy(): void {
        cancelAnimationFrame(this.frame);
        this.controller.destroy();
        this.observer.disconnect();
        this.abort.abort();
    }

    private get groundY(): number {
        return this.draw.getCanvas().height - 34;
    }

    private pause(): void {
        if (this.state !== 'running') return;
        this.state = 'paused';
        this.notify();
    }

    private notify(): void {
        this.lastScore = Math.floor(this.distance / 10);
        this.onChange({ state: this.state, score: this.lastScore, best: this.best });
    }

    private finish(): void {
        this.state = 'over';
        this.followerJumpDistance = null;
        this.best = Math.max(this.best, Math.floor(this.distance / 10));
        try { localStorage.setItem('wedding-runner-best', String(this.best)); } catch {}
        this.notify();
    }

    private update(deltaTime: number): void {
        const speed = Math.min(270 + this.elapsed * 3.5, 440);
        this.elapsed += deltaTime;
        this.distance += speed * deltaTime;
        const follower = this.players[0];
        let followerDeltaTime = deltaTime;
        if (this.followerJumpDistance !== null && this.distance >= this.followerJumpDistance && !follower.getIsJumping()) {
            followerDeltaTime = Math.min(deltaTime, (this.distance - this.followerJumpDistance) / speed);
            follower.setVelocityY(-580);
            follower.setIsJumping(true);
            this.followerJumpDistance = null;
        }
        for (const player of this.players) {
            this.physics.applyGravity(player, player === follower ? followerDeltaTime : deltaTime);
            if (player.getY() + player.getHeight() >= this.groundY && player.getVelocityY() >= 0) {
                player.setY(this.groundY - player.getHeight());
                player.setVelocityY(0);
                player.setIsJumping(false);
            }
        }
        this.spawnTimer -= deltaTime;
        if (this.spawnTimer <= 0) {
            const height = Math.random() < 0.5 ? 34 : 44;
            this.obstacles.push(new DrawObstacle('', this.draw.getCanvas().width + 40, this.groundY - height, 36, height));
            this.spawnTimer = 1.35 + Math.random() * 0.65;
        }
        for (const obstacle of this.obstacles) {
            obstacle.update(deltaTime, speed);
            if (this.players.some(player => obstacle.obstacle.collidesWith(player))) {
                this.finish();
                break;
            }
        }
        this.obstacles = this.obstacles.filter(({ obstacle }) => obstacle.getX() + obstacle.getWidth() > -10);
        if (Math.floor(this.distance / 10) !== this.lastScore) this.notify();
    }

    private render(deltaTime: number): void {
        const width = this.draw.getCanvas().width;
        const running = this.state === 'running';
        this.draw.drawBackground();
        this.background.drawLandscape(running ? deltaTime : 0, Math.min(270 + this.elapsed * 3.5, 440) / 4, this.draw.getCanvas().height);
        const travel = this.ambientTime * 10 + this.distance * 0.5;
        for (const cloud of getCloudLayout(width, travel)) {
            this.clouds[cloud.sprite].drawAt(cloud.left, cloud.top, cloud.width);
        }
        const archLeft = Math.min(width * 0.73, width - 200) - this.distance;
        if (archLeft > -210) {
            this.arch.drawAt(archLeft, this.groundY - 219, 188, 219);
            this.cake.drawAt(archLeft + 65, this.groundY - 65, 62, 65);
        }
        this.ground.drawLandscape(running ? deltaTime : 0, Math.min(270 + this.elapsed * 3.5, 440));
        for (const obstacle of this.obstacles) obstacle.drawObstacle();
        const animationTime = running ? this.elapsed : (this.state === 'ready' ? this.ambientTime : this.elapsed);
        this.players.forEach((player, index) => this.draw.drawPlayer(player, animationTime + index * 0.12, running));
    }

    private readonly loop = (time: number): void => {
        const deltaTime = this.previousTime ? Math.min((time - this.previousTime) / 1000, 0.04) : 0;
        this.previousTime = time;
        if (!document.hidden) {
            if (this.state === 'running' || (this.state === 'ready' && !this.reducedMotion.matches)) this.ambientTime += deltaTime;
            if (this.state === 'running') this.update(deltaTime);
            this.render(deltaTime);
        }
        this.frame = requestAnimationFrame(this.loop);
    };
}