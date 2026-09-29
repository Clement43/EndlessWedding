import type { Obstacle } from "./Obstacle"
import type { Player } from "./Player"

export class Draw {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private groundImage: HTMLImageElement
    private groundOffset: number
    private groundSpeed: number
    // private obstacleOffset: number

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        const ctx = this.canvas.getContext('2d')
        if (!ctx) {
            throw new Error('Unable to get 2D canvas context')
        }
        this.ctx = ctx
        this.groundOffset = 0
        this.groundSpeed = 0

        this.groundImage = new Image()
        this.groundImage.src = new URL('../asset/Ground.png', import.meta.url).href
    }

    public drawCircle(x: number, y: number, radius: number, color: string): void {

       this.ctx.beginPath()
       this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
       this.ctx.fillStyle = color
       this.ctx.fill()
    }

    public clearCanvas(): void {
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    public drawPlayer(player: Player): void {

        this.ctx.rect(player.getX(), player.getY(), 10, 10);
        this.ctx.fill()

    }

    public drawGround(deltaTime: number): void {
        if (!this.groundImage.complete || this.groundImage.naturalWidth === 0) {

            return
        }

        const groundWidth = this.groundImage.naturalWidth
        this.groundOffset = (this.groundOffset + this.groundSpeed * deltaTime) % groundWidth
        //A deplacer pour mettre le widht de l'obstacle
        
        const groundY = this.canvas.height - this.groundImage.naturalHeight
        for (let x = -this.groundOffset; x < this.canvas.width; x += groundWidth) {
            this.ctx.drawImage(this.groundImage, x, groundY)
        }
    }

    public drawObstacle(obstacles: Obstacle[], deltaTime:number): void {
        obstacles.forEach(obstacle => {
        obstacle.setObstacleOffset((obstacle.getObstacleOffset() + this.groundSpeed * deltaTime) % (this.canvas.width + obstacle.getWidth()));

        obstacle.setX(-obstacle.getObstacleOffset());
        obstacle.setX(obstacle.getX() + this.canvas.width);
        this.ctx.rect(obstacle.getX(), obstacle.getY(), obstacle.getWidth(), obstacle.getHeight());
        this.ctx.fill()
        })
    }


    public setGroundSpeed(speed: number): void {
        this.groundSpeed = speed
    }

}