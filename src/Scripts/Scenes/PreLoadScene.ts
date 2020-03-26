import "phaser";

export class PreLoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: "PreLoadScene"
        });
    }

    preload(): void {
        this.load.image("grassTile", "src/Assets/Tiles/platformPack_tile001.png");
        this.load.image("dirtTile", "src/Assets/Tiles/platformPack_tile004.png");
        this.load.spritesheet("character", "src/Assets/Spritesheet/platformerPack_character.png", { frameWidth: 96, frameHeight: 96 });
        this.load.image("fence", "src/Assets/Tiles/platformPack_tile038.png");
        this.load.image("gear", "src/Assets/Tiles/platformPack_tile024.png");
        this.load.image("background", "src/Assets/Background/pointy_mountains.png");
        this.load.image("cloud1", "src/Assets/Background/cloud1.png");
        this.load.image("cloud2", "src/Assets/Background/cloud2.png");
        this.load.image("cloud3", "src/Assets/Background/cloud3.png");
        this.load.image("cloud4", "src/Assets/Background/cloud4.png");
        this.load.image("cloud5", "src/Assets/Background/cloud5.png");
        this.load.image("cloud6", "src/Assets/Background/cloud6.png");
        this.load.image("cloud7", "src/Assets/Background/cloud7.png");
        this.load.image("cloud8", "src/Assets/Background/cloud8.png");
        this.load.image("cloud9", "src/Assets/Background/cloud9.png");
        this.load.image("coin", "src/Assets/Items/platformPack_item008.png");
        this.load.audio("jump", "src/Assets/Sound/phaserUp5.ogg");
        this.load.audio("coinSound", "src/Assets/Sound/highUp.ogg");
    }

    create(): void {
        this.scene.start("GameScene");
    }
}