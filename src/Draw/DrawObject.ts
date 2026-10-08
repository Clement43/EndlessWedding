import { Draw } from "./Draw";

export class DrawObject extends Draw {
	private sprite: HTMLCanvasElement | HTMLImageElement;

	constructor(url: string, removeBackdrop = false) {
		super(url);
		this.sprite = this.image;
		if (removeBackdrop) {
			this.image.addEventListener('load', () => {
				const surface = document.createElement('canvas');
				surface.width = this.image.naturalWidth;
				surface.height = this.image.naturalHeight;
				const context = surface.getContext('2d');
				if (!context) return;
				context.drawImage(this.image, 0, 0);
				const pixels = context.getImageData(0, 0, surface.width, surface.height);
				const sample = ((surface.height - 1) * surface.width + Math.floor(surface.width / 2)) * 4;
				const [red, green, blue, alpha] = pixels.data.slice(sample, sample + 4);
				if (alpha === 255) {
					for (let index = 0; index < pixels.data.length; index += 4) {
						if (pixels.data[index] === red && pixels.data[index + 1] === green && pixels.data[index + 2] === blue) pixels.data[index + 3] = 0;
					}
					context.putImageData(pixels, 0, 0);
				}
				this.sprite = surface;
			}, { once: true });
		}
	}

	public drawAt(positionX: number, positionY: number, width: number, height?: number): void {
		if (!this.image.complete || !this.image.naturalWidth) return;
		this.ctx.drawImage(this.sprite, Math.round(positionX), Math.round(positionY), width, height ?? width * this.image.naturalHeight / this.image.naturalWidth);
	}
}