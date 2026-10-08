import { Entity } from "./Entity";

export type Character = 'bride' | 'groom';

export class Player extends Entity {
    private isJumping: boolean;
    private velocityY: number;
    private character: Character;

    constructor(x: number, y: number, character: Character = 'bride') {
        super(x, y, 32, 48);
        this.isJumping = false;
        this.velocityY = 0;
        this.character = character;
    }

    public getCharacter(): Character {
        return this.character;
    }

    public setCharacter(character: Character): void {
        this.character = character;
    }

    public getIsJumping(): boolean {
        return this.isJumping;
    }

    public setIsJumping(isJumping: boolean): void {
        this.isJumping = isJumping;
    }

    public getVelocityY(): number {
        return this.velocityY;
    }

    public setVelocityY(velocityY: number): void {
        this.velocityY = velocityY;
    }

}