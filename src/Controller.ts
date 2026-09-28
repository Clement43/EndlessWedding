import type { Player } from "./Player";

export class Controller {

private player: Player;

    constructor(player: Player) {
        this.player = player;
        document.addEventListener('keydown', (event) => {
            if (event.key === ' ') {
                if (!this.player.getIsJumping()) {
                this.jump();
                }
            }
        });
    }


    //jump the player
    private jump() {
        this.player.setVelocityY(-5); // Set an initial upward velocity
        this.player.setIsJumping(true);
    }
}