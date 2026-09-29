import { Controller } from './Controller'
import { Draw } from './Draw'
import { Physics } from './Physics'
import { Player } from './Player'
import './style.css'
// import heroImg from './assets/hero.png'
// import typescriptLogo from './assets/typescript.svg'
// import viteLogo from './assets/vite.svg'

const heightGround = 30;
const cavansheight = 400;


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<canvas id="canvas" width="800" height="${cavansheight}"></canvas>
<button id="playBtn">Jouer</button>
`
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

//Boutton play to start the game, hide the button and start the game loop
const bouton = document.getElementById("playBtn");
if (bouton) {
    bouton.addEventListener("click", function(event) {
        if (event.target instanceof HTMLElement) {
            event.target.style.display = "none";
            playGame();
        } 
    });
}

//Init the new objects for the game
let draw = new Draw(canvas);
let player = new Player(50,cavansheight - heightGround);
new Controller(player);
let physics = new Physics();

// Assuming a frame rate of 60 FPS, deltaTime is approximately 1/60
draw.drawPlayer(player);
draw.drawCircle(200, 200, 50, 'red');
draw.clearCanvas();

let previousFrameTime = 0;
requestAnimationFrame(mainLoop);


//Loop execute all draw and anniamtion function
function mainLoop(currentTime: number) {
    const deltaTime = previousFrameTime === 0 ? 0 : (currentTime - previousFrameTime) / 1000;
    previousFrameTime = currentTime;

    draw.clearCanvas();
    physics.applyGravity(player, currentTime);

    if (player.getY() > canvas.height - heightGround) {
        player.setY(canvas.height - heightGround);
        player.setIsJumping(false);
    }
    draw.drawGround(deltaTime);
    draw.drawPlayer(player);
    requestAnimationFrame(mainLoop);
}


function playGame() {
    draw.setGroundSpeed(200); // Example speed
}