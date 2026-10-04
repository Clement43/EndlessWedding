
//Class that allows drawing the background that moves with the run
export class DrawnLandscape {

    private offset: number
    private image: HTMLImageElement
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, imgUrl: string) {
        this.offset = 0
        this.canvas = canvas
        this.ctx = ctx
        this.image = new Image()
        this.image.src = new URL(imgUrl, import.meta.url).href
    }

        public drawLandscape(deltaTime: number, speed: number): void {
        if (!this.image.complete || this.image.naturalWidth === 0) {
            return
        }

        const groundWidth = this.image.naturalWidth
        this.offset = (this.offset + speed * deltaTime) % groundWidth
        //A deplacer pour mettre le widht de l'obstacle
        
        const groundY = this.canvas.height - this.image.naturalHeight
        for (let x = -this.offset; x < this.canvas.width; x += groundWidth - 1) {
            this.ctx.drawImage(this.image, x, groundY)
        }
    }

}