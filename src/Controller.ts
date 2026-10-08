export class Controller {
    private readonly abort = new AbortController();

    constructor(canvas: HTMLCanvasElement, jump: () => void, pause: () => void) {
        const options = { signal: this.abort.signal };
        canvas.addEventListener('keydown', (event) => {
            if (['Space', 'ArrowUp', 'KeyW'].includes(event.code)) {
                event.preventDefault();
                if (!event.repeat) jump();
            }
            if (['Escape', 'KeyP'].includes(event.code)) {
                event.preventDefault();
                if (!event.repeat) pause();
            }
        }, options);
        canvas.addEventListener('pointerdown', (event) => {
            if (event.pointerType === 'mouse' && event.button !== 0) return;
            canvas.focus({ preventScroll: true });
            jump();
        }, options);
    }

    public destroy(): void {
        this.abort.abort();
    }
}