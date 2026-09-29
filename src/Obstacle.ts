import { Entity } from "./Entity";

export class Obstacle extends Entity {


    // private imlage: HTMLImageElement;
    private obstacleOffset: number = 0; 

    constructor(width: number, height: number, y:number ) {

        // this.imlage = new Image();
        // this.imlage.src = new URL('../asset/Obstacle.png', import.meta.url).href;
        super( y, 900, width, height); // width, height, y, x
    }

    public getObstacleOffset(): number {
        return this.obstacleOffset;
    }
    public setObstacleOffset(offset: number): void {
        this.obstacleOffset = offset;
    }

}