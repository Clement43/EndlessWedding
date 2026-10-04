import { Entity } from "./Entity";

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

}