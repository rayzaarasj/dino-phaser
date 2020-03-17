import "phaser";

export class PreLoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: "PreLoadScene"
        });
    }

    preload(): void {
        this.load.image("character", "src/Assets/Characters/platformChar_walk1.png");
        this.load.image("tile", "src/Assets/Tiles/platformPack_tile001.png");
    }

    create(): void {
        this.scene.start("GameScene");
    }
}