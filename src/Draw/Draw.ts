import type { Player } from "../Player"

export class Draw {

    protected canvas: HTMLCanvasElement
    protected ctx: CanvasRenderingContext2D
    protected offset: number
    protected image: HTMLImageElement


    constructor(imgUrl: string = "") {
        this.canvas =  document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = this.canvas.getContext('2d')
        if (!ctx) {
            throw new Error('Unable to get 2D canvas context')
        }
        this.ctx = ctx
        this.image = new Image()
        if (imgUrl) this.image.src = imgUrl
        this.offset = 0
        }


    public clearCanvas(): void {
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    public drawBackground(): void {
        const { width, height } = this.canvas;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.fillStyle = '#4abafc';
        this.ctx.fillRect(0, 0, width, height);
    }

    public drawPlayer(player: Player, time = 0, running = false): void {
        Draw.drawPlayerSprite(this.ctx, player, time, running);
    }

    public static drawPlayerSprite(context: CanvasRenderingContext2D, player: Player, time = 0, running = false): void {
        const jumping = player.getIsJumping();
        const stride = running && !jumping ? Math.sin(time * 18) : 0;
        const bounce = running && !jumping ? Math.abs(stride) * 2 : Math.sin(time * 3) * 0.7;
        const originX = Math.round(player.getX());
        const originY = Math.round(player.getY() - bounce);
        const pixel = (color: string, localX: number, localY: number, width: number, height: number) => {
            context.fillStyle = color;
            context.fillRect(originX + localX * 2, originY + localY * 2, width * 2, height * 2);
        };
        if (player.getCharacter() === 'groom') {
            const legOffset = Math.round(stride * 2);
            const armOffset = Math.round(stride);
            pixel('#4a3436', 3, 0, 8, 2);
            pixel('#4a3436', 2, 2, 11, 3);
            pixel('#c9906f', 4, 3, 8, 6);
            pixel('#4a3436', 2, 3, 3, 4);
            pixel('#293d35', 10, 4, 1, 1);
            pixel('#e79b92', 10, 7, 2, 1);
            pixel('#c9906f', 6, 9, 4, 2);
            pixel('#183958', 3, 10, 10, 8);
            pixel('#fffdf1', 6, 10, 4, 5);
            pixel('#719dbe', 4, 10, 2, 4);
            pixel('#719dbe', 10, 10, 2, 4);
            pixel('#d7748b', 6, 11, 4, 1);
            pixel('#f7cc77', 8, 15, 1, 1);
            pixel('#d7748b', 11, 12, 2, 2);
            pixel('#719dbe', 1, 11 + armOffset, 2, 5);
            pixel('#c9906f', 1, 16 + armOffset, 2, 2);
            pixel('#719dbe', 12, jumping ? 10 : 12 - armOffset, 3, 4);
            pixel('#c9906f', 13, jumping ? 9 : 16 - armOffset, 3, 2);
            pixel('#183958', 3 + legOffset, 18, 4, jumping ? 4 : 5);
            pixel('#183958', 9 - legOffset, 18, 4, jumping ? 3 : 5);
            pixel('#081e31', 3 + legOffset, jumping ? 22 : 23, 5, 1);
            pixel('#081e31', 9 - legOffset, jumping ? 21 : 23, 5, 1);
            return;
        }
        pixel('#fff9ee', -4, 5, 8, 3);
        pixel('#fff9ee', -6, 8 + Math.round(stride), 7, 3);
        pixel('#e0e4d8', -7, 11 + Math.round(stride), 5, 2);
        pixel('#4a3436', 3, 0, 8, 2);
        pixel('#4a3436', 1, 2, 11, 5);
        pixel('#c9906f', 5, 3, 7, 6);
        pixel('#4a3436', 2, 2, 4, 8);
        pixel('#293d35', 10, 4, 1, 1);
        pixel('#e79b92', 10, 7, 2, 1);
        pixel('#fff9ee', 3, 1, 3, 2);
        pixel('#e97b9b', 2, 0, 2, 3);
        pixel('#f7cc77', 2, 1, 1, 1);
        pixel('#c9906f', 6, 9, 4, 2);
        pixel('#fffdf1', 4, 10, 7, 5);
        pixel('#f3e7d9', 3, 15, 9, 2);
        pixel('#fffdf1', 1, 17, 13, 3);
        pixel('#fffdf1', 0, 20, 15, 2);
        pixel('#d2dcca', 1, 21, 4, 1);
        pixel('#d2dcca', 10, 17, 2, 4);
        pixel('#c9906f', 10, 12, 4, 2);
        pixel('#4d7354', 14, 9, 1, 5);
        pixel('#e97b9b', 12, 8, 5, 3);
        pixel('#ffe4be', 13, 7, 2, 2);
        pixel('#293d35', 3 + Math.round(stride * 2), 22, 3, jumping ? 1 : 2);
        pixel('#293d35', 9 - Math.round(stride * 2), jumping ? 21 : 22, 3, 2);
    }


    public drawScore(text: string, fontSize: number): void {
    this.ctx.font = `${fontSize}px Triton`
    
    let positionX = this.canvas.clientWidth - this.ctx.measureText(text).width - 20;
    

    this.ctx.fillStyle = "#2366a9"
    this.ctx.beginPath();
    this.ctx.roundRect(positionX-10, 10, this.ctx.measureText(text).width + 20, 25, 10);
    this.ctx.fill();

    this.ctx.fillStyle = "#faf7f6"
    this.ctx.fillText(text, positionX, 30)


}

public getCanvas(): HTMLCanvasElement {
    return this.canvas;
}
    




}