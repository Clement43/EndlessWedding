import { Controller } from './Controller'
import { Draw } from './Draw'
import { DrawnLandscape } from './DrawnLandscape'
import { Obstacle } from './Obstacle'
import { Physics } from './Physics'
import { Player } from './Player'
import './style.css'


// import heroImg from './assets/hero.png'
// import typescriptLogo from './assets/typescript.svg'
// import viteLogo from './assets/vite.svg'

const heightGround = 21;
const cavansheight = 400;
let  speedGame = 0; // Speed of the game, can be changed to make the game more difficult


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

let drawnGround = new DrawnLandscape(canvas, canvas.getContext('2d')!, '../asset/Ground.png');
let drawnShadow = new DrawnLandscape(canvas, canvas.getContext('2d')!, '../asset/Shadow.png');
// let obstacle2 = new Obstacle(30, 30 , yGroundObstacle);

let lsiteObstacle = [obstacle];

draw.drawPlayer(player);
draw.clearCanvas();

let previousFrameTime: number = 0;
let isGameRunning: boolean = true;
let score: number = 0;

requestAnimationFrame(mainLoop);

//Loop execute all draw and anniamtion function
function mainLoop(currentTime: number) {
    // Temps ecoule depuis la frame precedente, en secondes. Il permet d'adapter
    // les mouvements a la duree reelle de chaque frame.
    const deltaTime = previousFrameTime === 0 ? 0 : (currentTime - previousFrameTime) / 1000;
    previousFrameTime = currentTime;
    draw.clearCanvas();
    physics.applyGravity(player, currentTime);

    if (player.getY() > canvas.height - heightGround) {
        player.setY(yGroundPlayer);
        player.setIsJumping(false);
    }
    drawnShadow.drawLandscape(deltaTime, speedGame / 4);
    drawnGround.drawLandscape(deltaTime, speedGame);

    score += deltaTime * speedGame / 10;
    draw.drawScore("SCORE: " + Math.floor(score), 20);


    draw.drawPlayer(player);
    draw.drawObstacle(lsiteObstacle, deltaTime, speedGame);
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
    speedGame = 200; // Example speed
}