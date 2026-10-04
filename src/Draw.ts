import type { Obstacle } from "./Obstacle"
import type { Player } from "./Player"

export class Draw {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        const ctx = this.canvas.getContext('2d')
        if (!ctx) {
            throw new Error('Unable to get 2D canvas context')
        }
        this.ctx = ctx

        }


    public clearCanvas(): void {
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    public drawPlayer(player: Player): void {
        this.ctx.beginPath();
        this.ctx.rect(player.getX(), player.getY(), 10, 10);
        this.ctx.fill()

    }


    public drawObstacle(obstacles: Obstacle[], deltaTime:number, speed: number): void {
        obstacles.forEach(obstacle => {
        obstacle.setObstacleOffset((obstacle.getObstacleOffset() + speed * deltaTime) % (this.canvas.width + obstacle.getWidth()));

        obstacle.setX(-obstacle.getObstacleOffset());
        obstacle.setX(obstacle.getX() + this.canvas.width);
        this.ctx.beginPath();
        this.ctx.rect(obstacle.getX(), obstacle.getY(), obstacle.getWidth(), obstacle.getHeight());
        this.ctx.fill()
        })
    }

    public drawScore(text: string, fontSize: number): void {
    this.ctx.font = `${fontSize}px Triton`
    
    let positionX = this.canvas.clientWidth - this.ctx.measureText(text).width - 20;
    

    this.ctx.fillStyle = "#2366a9"
    this.ctx.beginPath();
    this.ctx.roundRect(positionX-10, 10, this.ctx.measureText(text).width + 20, 25, 10);
    this.ctx.fill();

    this.ctx.fillStyle = "#faf7f6"
    this.ctx.fillText(text, positionX, 30)


}
    




}