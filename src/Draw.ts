import type { Player } from "./Player"

export class Draw {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        const ctx = this.canvas.getContext('2d')
        if (!ctx) {
            throw new Error('Unable to get 2D canvas context')
        }
        this.ctx = ctx
        
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




}