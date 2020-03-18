import "phaser";
import { FacebookInstantGamesLeaderboard, Physics } from "phaser";

export class GameScene extends Phaser.Scene {
    grassTiles: Phaser.Physics.Arcade.Group;
    dirtTiles1: Phaser.Physics.Arcade.Group;
    dirtTiles2: Phaser.Physics.Arcade.Group;
    dirtTiles3: Phaser.Physics.Arcade.Group;
    character: Phaser.Physics.Arcade.Sprite;
    isWalking: boolean;
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
        this.isWalking = false;
    }

    create(): void {
        this.anims.create({
            key:  "walk",
            frames: this.anims.generateFrameNumbers("characterSheet", { start: 2, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: "jump",
            frames: this.anims.generateFrameNumbers("characterSheet", { frames: [2,7] }),
            frameRate: 2,
            repeat: 0
        });

        this.character = this.physics.add.sprite(200, 200, "characterSheet");
        this.character.play("walk");
        this.character.setSize(64,96);

        this.input.keyboard.on("keydown_UP", function (event: any) {
            if (this.isWalking) {
                this.character.setVelocityY(-250);
                this.character.play("jump");
                this.isWalking = false;
            }
        }, this);

        this.grassTiles = this.createTiles(100, 500, "grassTile", 20);
        this.dirtTiles1 = this.createTiles(100, 500+(this.TILE_SIZE), "dirtTile", 20);
        this.dirtTiles2 = this.createTiles(100, 500+(2*this.TILE_SIZE), "dirtTile", 20);
        this.dirtTiles3 = this.createTiles(100, 500+(3*this.TILE_SIZE), "dirtTile", 20);

        this.character.setGravityY(200);
        this.physics.add.collider(
            this.character, 
            [this.grassTiles],
            function (_character: any, _grassTile: any) {
            if (_character.body.touching.down && _grassTile.body.touching.up && !this.isWalking) {
                _character.play("walk");
                this.isWalking = true;
            }
        },null, this);
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