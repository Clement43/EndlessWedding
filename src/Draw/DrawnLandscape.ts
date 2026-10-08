import { Draw } from "./Draw"

//Class that allows drawing the background that moves with the run
export class DrawnLandscape extends Draw {



    constructor(imgUrl: string) {
        super(imgUrl)

    }

        public drawLandscape(deltaTime: number, speed: number, renderHeight?: number): void {
        if (!this.image.complete || this.image.naturalWidth === 0) {
            return
        }

        const groundHeight = renderHeight ?? this.image.naturalHeight * 2
        const groundWidth = Math.round(this.image.naturalWidth * groundHeight / this.image.naturalHeight)
        this.offset = (this.offset + speed * deltaTime) % groundWidth
        //A deplacer pour mettre le widht de l'obstacle
        
        const groundY = this.canvas.height - groundHeight
        for (let x = -this.offset; x < this.canvas.width; x += groundWidth) {
            this.ctx.drawImage(this.image, Math.round(x), groundY, groundWidth, groundHeight)
        }
    }

    public reset(): void {
        this.offset = 0;
    }
}