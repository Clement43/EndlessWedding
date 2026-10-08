import { Entity } from "./Entity";
import type { Player } from './Player';

export class Obstacle extends Entity {


    // private imlage: HTMLImageElement;
    private obstacleOffset: number = 0; 

    constructor(x: number, y: number, width: number, height: number) {
        
        super(x, y, width, height); // width, height, y, x
        this.obstacleOffset = x;
    }

    public getObstacleOffset(): number {
        return this.obstacleOffset;
    }
    public setObstacleOffset(offset: number): void {
        this.obstacleOffset = offset;
    }

    public collidesWith(player: Player): boolean {
        return player.getX() + 7 < this.getX() + this.getWidth() - 4
            && player.getX() + player.getWidth() - 7 > this.getX() + 4
            && player.getY() + 5 < this.getY() + this.getHeight()
            && player.getY() + player.getHeight() - 3 > this.getY() + 4;
    }
}