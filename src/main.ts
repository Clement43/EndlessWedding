import { Controller } from './Controller'
import { Draw } from './Draw'
import { Obstacle } from './Obstacle'
import { Physics } from './Physics'
import { Player } from './Player'
import './style.css'
// import heroImg from './assets/hero.png'
// import typescriptLogo from './assets/typescript.svg'
// import viteLogo from './assets/vite.svg'

const heightGround = 21;
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

// 10 is the heaight of the player same for obstacle
const yGroundPlayer = cavansheight - heightGround - 10;
const yGroundObstacle = cavansheight - heightGround - 50;

//Init the new objects for the game
let draw = new Draw(canvas);
let player = new Player(50, yGroundPlayer);
new Controller(player);
let physics = new Physics();
let obstacle = new Obstacle(50, 50 , yGroundObstacle);
// let obstacle2 = new Obstacle(30, 30 , yGroundObstacle);

let lsiteObstacle = [obstacle];

draw.drawPlayer(player);
draw.drawCircle(200, 200, 50, 'red');
draw.clearCanvas();

let previousFrameTime: number = 0;
let isGameRunning: boolean = true;

requestAnimationFrame(mainLoop);

//Loop execute all draw and anniamtion function
function mainLoop(currentTime: number) {
    // Temps ecoule depuis la frame precedente, en secondes. Il permet d'adapter
    // les mouvements a la duree reelle de chaque frame.
    const deltaTime = previousFrameTime === 0 ? 0 : (currentTime - previousFrameTime) / 1000;
    previousFrameTime = currentTime;
    console.log("deltaTime: ", deltaTime);
    draw.clearCanvas();
    physics.applyGravity(player, currentTime);

    if (player.getY() > canvas.height - heightGround) {
        player.setY(yGroundPlayer);
        player.setIsJumping(false);
    }
    draw.drawGround(deltaTime);
    draw.drawPlayer(player);
    draw.drawObstacle(lsiteObstacle, deltaTime);
    colisionDetection(player, lsiteObstacle);
    if (isGameRunning) {
        requestAnimationFrame(mainLoop);
    }
}


function colisionDetection(player: Player, obstacles: Obstacle[]): boolean {
    for (const obstacle of obstacles) {
        if (
            player.getX() < obstacle.getX() + obstacle.getWidth() &&
            player.getX() + player.getWidth() > obstacle.getX() &&
            player.getY() < obstacle.getY() + obstacle.getHeight() &&
            player.getY() + player.getHeight() > obstacle.getY()

        ) {
            console.log("Collision detected!");
            isGameRunning = false;

        }
    }
    return false; // No collision
}

function playGame() {
    draw.setGroundSpeed(200); // Example speed
}