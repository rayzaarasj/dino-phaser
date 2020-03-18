import "phaser";
import { FacebookInstantGamesLeaderboard, Physics } from "phaser";

export class GameScene extends Phaser.Scene {
    grassTiles: Phaser.Physics.Arcade.Group;
    dirtTiles1: Phaser.Physics.Arcade.Group;
    dirtTiles2: Phaser.Physics.Arcade.Group;
    dirtTiles3: Phaser.Physics.Arcade.Group;
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

        this.grassTiles = this.createTiles(100, 500, "grassTile", 20);
        this.dirtTiles1 = this.createTiles(100, 500+(this.TILE_SIZE), "dirtTile", 20);
        this.dirtTiles2 = this.createTiles(100, 500+(2*this.TILE_SIZE), "dirtTile", 20);
        this.dirtTiles3 = this.createTiles(100, 500+(3*this.TILE_SIZE), "dirtTile", 20);

        character.setGravityY(200);
        this.physics.add.collider(character, [this.grassTiles]);
    }

    update(time: any): void {
        this.grassTiles.incX(this.groudSpeed);
        this.checkInfiniteLoop(this.grassTiles, 500, "grassTile");

        this.dirtTiles1.incX(this.groudSpeed);
        this.checkInfiniteLoop(this.dirtTiles1, 500+(this.TILE_SIZE), "dirtTile");

        this.dirtTiles2.incX(this.groudSpeed);
        this.checkInfiniteLoop(this.dirtTiles2, 500+(2*this.TILE_SIZE), "dirtTile");

        this.dirtTiles3.incX(this.groudSpeed);
        this.checkInfiniteLoop(this.dirtTiles3, 500+(3*this.TILE_SIZE), "dirtTile");
    }

    private createTiles(x: integer, y: integer, image: string, amount: integer): Physics.Arcade.Group {
        var tiles = this.physics.add.group({ immovable : true });
        for (var i = 0; i < amount; i++) {
            var tile = tiles.create(x+(i*this.TILE_SIZE), y, image);
            this.physics.add.existing(tile);
            tile.body.setImmovable();
        }
        return tiles;
    }

    private checkInfiniteLoop(tiles: Phaser.Physics.Arcade.Group, y: integer, image: string): void {
        var firstTile = tiles.getFirst(true);
        if (firstTile.x <= -(this.TILE_SIZE/2)) { 
            firstTile.destroy();

            var lastTile = tiles.getLast(true);
            var nextTile = tiles.create(lastTile.x+this.TILE_SIZE, y, image);
            this.physics.add.existing(nextTile);
            nextTile.body.setImmovable();
        }
    }
}