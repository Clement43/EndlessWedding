import { Controller } from './Controller'
import { Draw } from './Draw'
import { Physics } from './Physics'
import { Player } from './Player'
import './style.css'
// import heroImg from './assets/hero.png'
// import typescriptLogo from './assets/typescript.svg'
// import viteLogo from './assets/vite.svg'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<canvas id="canvas" width="800" height="600"></canvas>
`
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
let draw = new Draw(canvas);

let player = new Player(100, 100);
new Controller(player);
let physics = new Physics();

// Assuming a frame rate of 60 FPS, deltaTime is approximately 1/60
draw.drawPlayer(player);
draw.drawCircle(200, 200, 50, 'red');
draw.clearCanvas();

requestAnimationFrame(mainLoop);

function mainLoop(currentTime: number) {
    draw.clearCanvas();
    physics.applyGravity(player, currentTime);

    if (player.getY() > canvas.height - 10) {
        player.setY(canvas.height - 10);
        player.setIsJumping(false);
    }
    draw.drawPlayer(player);
    requestAnimationFrame(mainLoop);
}