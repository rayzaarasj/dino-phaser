import "phaser";

export class PreLoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: "PreLoadScene"
        });
    }

    preload(): void {
        this.load.image("character", "src/Assets/Characters/platformChar_walk1.png");
        this.load.image("grassTile", "src/Assets/Tiles/platformPack_tile001.png");
        this.load.image("dirtTile", "src/Assets/Tiles/platformPack_tile004.png")
    }

    create(): void {
        this.scene.start("GameScene");
    }
}