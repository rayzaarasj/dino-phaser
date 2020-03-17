import "phaser";

export class GameScene extends Phaser.Scene {
    // tile: Phaser.Physics.Arcade.Image;
    tiles: Phaser.Physics.Arcade.Group;
    groudSpeed: integer;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(): void {
        this.groudSpeed = -2;
    }

    preload(): void {
        this.load.image("character", "src/Assets/Characters/platformChar_walk1.png");
        this.load.image("tile", "src/Assets/Tiles/platformPack_tile001.png");
    }

    create(): void {
        var character = this.physics.add.image(200, 200, "character");

        this.tiles = this.physics.add.group({ immovable : true });
        for (var i = 0; i < 20; i++) {
            var tile = this.tiles.create(100+(i*64), 500, "tile");
            this.physics.add.existing(tile);
            tile.body.setImmovable();
        }

        character.setGravityY(200);
        this.physics.add.collider(character, [this.tiles]);
        
    }

    update(time): void {
        this.tiles.incX(this.groudSpeed);
        var tile = this.tiles.getLast(true);
        console.log(tile.x);
    }
}