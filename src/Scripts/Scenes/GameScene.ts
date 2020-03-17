import "phaser";
import { FacebookInstantGamesLeaderboard } from "phaser";

export class GameScene extends Phaser.Scene {
    tiles: Phaser.Physics.Arcade.Group;
    groudSpeed: integer;
    TILE_SIZE: integer;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(): void {
        this.groudSpeed = -2;
        this.TILE_SIZE = 64;
    }

    create(): void {
        var character = this.physics.add.image(200, 200, "character");

        this.tiles = this.physics.add.group({ immovable : true });
        for (var i = 0; i < 20; i++) {
            var tile = this.tiles.create(100+(i*this.TILE_SIZE), 500, "tile");
            this.physics.add.existing(tile);
            tile.body.setImmovable();
        }

        character.setGravityY(200);
        this.physics.add.collider(character, [this.tiles]);
    }

    update(time): void {
        this.tiles.incX(this.groudSpeed);
        var firstTile = this.tiles.getFirst(true);
        if (firstTile.x <= -(this.TILE_SIZE/2)) { 
            firstTile.destroy();

            var lastTile = this.tiles.getLast(true);
            var nextTile = this.tiles.create(lastTile.x+this.TILE_SIZE, 500, "tile");
            this.physics.add.existing(nextTile);
            nextTile.body.setImmovable();
        } 
    }
}