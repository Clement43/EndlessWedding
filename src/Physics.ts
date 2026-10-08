import type { Player } from "./Player"

export class Physics {
    private readonly gravity = 1600;

    applyGravity(player: Player, deltaTime: number): void {
        if (!player.getIsJumping()) return;

        player.setY(player.getY() + player.getVelocityY() * deltaTime + this.gravity * deltaTime * deltaTime / 2);
        player.setVelocityY(player.getVelocityY() + this.gravity * deltaTime);
    }

}