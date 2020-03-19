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
        this.load.image("dirtTile", "src/Assets/Tiles/platformPack_tile004.png");
        this.load.spritesheet("characterSheet", "src/Assets/Spritesheet/platformerPack_character.png", { frameWidth: 96, frameHeight: 96 });
        this.load.image("fence", "src/Assets/Tiles/platformPack_tile038.png");
        this.load.image("gear", "src/Assets/Tiles/platformPack_tile024.png");
        this.load.image("background", "src/Assets/Background/pointy_mountains.png");
    }

    create(): void {
        this.scene.start("GameScene");
    }
}