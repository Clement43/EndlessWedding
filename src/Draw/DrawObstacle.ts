import { Obstacle } from "../Obstacle";
import { Draw } from "./Draw";

export class DrawObstacle extends Draw {

    public obstacle: Obstacle;

    constructor(imgUrl: string , x: number, y: number, width: number, height: number) {
        super(imgUrl)
        this.obstacle = new Obstacle(x, y, width, height);
    }
    

    public drawObstacle( deltaTime:number, speed: number): void {

        this.obstacle.setObstacleOffset((this.obstacle.getObstacleOffset() + speed * deltaTime));

        this.obstacle.setX(-this.obstacle.getObstacleOffset());
        this.obstacle.setX(this.obstacle.getX() + this.canvas.width);
        this.ctx.beginPath();
        this.ctx.drawImage(this.image, this.obstacle.getX(), this.obstacle.getY(), this.obstacle.getWidth(), this.obstacle.getHeight());
        this.ctx.fill()
    }

}