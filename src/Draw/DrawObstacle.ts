import { Obstacle } from "../Obstacle";
import { Draw } from "./Draw";

export class DrawObstacle extends Draw {

    public obstacle: Obstacle;

    constructor(imgUrl: string , x: number, y: number, width: number, height: number) {
        super(imgUrl)
        this.obstacle = new Obstacle(x, y, width, height);
    }
    

    public update(deltaTime: number, speed: number): void {
        this.obstacle.setX(this.obstacle.getX() - speed * deltaTime);
    }

    public drawObstacle(): void {
        const left = Math.round(this.obstacle.getX());
        const top = this.obstacle.getY();
        const width = this.obstacle.getWidth();
        const height = this.obstacle.getHeight();
        this.ctx.fillStyle = '#385847';
        this.ctx.fillRect(left - 2, top + 6, width + 4, height - 6);
        this.ctx.fillStyle = height < 40 ? '#d7748b' : '#709384';
        this.ctx.fillRect(left, top + 8, width, height - 10);
        this.ctx.fillRect(left - 2, top + 4, width + 4, 8);
        this.ctx.fillStyle = '#ffdf9c';
        this.ctx.fillRect(left + 14, top + 4, 7, height - 4);
        this.ctx.fillRect(left + 5, top - 2, 10, 5);
        this.ctx.fillRect(left + 21, top - 2, 10, 5);
        this.ctx.fillRect(left + 10, top + 2, 17, 4);
    }

}