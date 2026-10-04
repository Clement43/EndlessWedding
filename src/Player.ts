import { Entity } from "./Entity";

export class Player extends Entity {
    private isJumping: boolean;
    private velocityY: number;

    constructor(x: number, y: number) {
        super( x, y, 10, 10); // width, height, y, x
        this.isJumping = false;
        this.velocityY = 0;
    }

    public getIsJumping(): boolean {
        return this.isJumping;
    }

    public setIsJumping(isJumping: boolean): void {
        this.isJumping = isJumping;
    }

    public getVelocityY(): number {
        return this.velocityY;
    }

    public setVelocityY(velocityY: number): void {
        this.velocityY = velocityY;
    }

}