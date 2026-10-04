import { Draw } from "./Draw"

//Class that allows drawing the background that moves with the run
export class DrawnLandscape extends Draw {



    constructor(imgUrl: string) {
        super(imgUrl)

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