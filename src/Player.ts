export class Player {
    private x: number;
    private y: number;
    private isJumping: boolean;
    private velocityY: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.isJumping = false;
        this.velocityY = 0;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public setX(x: number): void {
        this.x = x;
    }

    public setY(y: number): void {
        this.y = y;
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