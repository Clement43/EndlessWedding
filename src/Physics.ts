import type { Player } from "./Player"

export class Physics {
    private gravity: number
    private previousTime: number

    constructor() {
        this.gravity = 0.5;
        this.previousTime = 0;

    }

    //Aply gravity to the player, updating its vertical position and velocity based on the time elapsed since the last frame.
    applyGravity(player: Player, currentTime: number): void {
        
        if (player.getIsJumping()) {
            if (this.previousTime === 0) {
                this.previousTime = performance.now();
            }
            const deltaTime = (currentTime - this.previousTime) / 1000;

            player.setVelocityY(player.getVelocityY() + this.gravity * deltaTime);
            player.setY(player.getY() + player.getVelocityY());
        }else {
            this.previousTime = 0;
        }
    }

}