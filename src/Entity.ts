export abstract class Entity {

    private x: number;
    private y: number
    private width: number;
    private height: number;

    constructor( y:number , x: number ,width: number, height: number,) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }
}