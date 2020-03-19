import "phaser";
import { Physics } from "phaser";

export class GameScene extends Phaser.Scene {
    grassTiles: Phaser.Physics.Arcade.Group;
    dirtTiles1: Phaser.Physics.Arcade.Group;
    dirtTiles2: Phaser.Physics.Arcade.Group;
    dirtTiles3: Phaser.Physics.Arcade.Group;
    obstacles: Phaser.Physics.Arcade.Group;
    backgrounds: Phaser.Physics.Arcade.Group;
    clouds: Phaser.Physics.Arcade.Group;
    character: Phaser.Physics.Arcade.Sprite;
    grassCollider: Phaser.Physics.Arcade.Collider;
    obstacleCollider: Phaser.Physics.Arcade.Collider;
    isWalking: boolean;
    groudSpeed: integer;
    TILE_SIZE: integer;
    isPlaying: boolean;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(): void {
        this.groudSpeed = -3;
        this.TILE_SIZE = 64;
        this.isWalking = false;
        this.isPlaying = true;
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

        this.anims.create({
            key: "duck",
            frames: this.anims.generateFrameNumbers("characterSheet", { frames: [6] }),
            frameRate: 1,
            repeat: 0
        });

        this.grassTiles = this.createTiles(0, 500, "grassTile", 20, this.TILE_SIZE);
        this.dirtTiles1 = this.createTiles(0, 500+(this.TILE_SIZE), "dirtTile", 20, this.TILE_SIZE);
        this.dirtTiles2 = this.createTiles(0, 500+(2*this.TILE_SIZE), "dirtTile", 20, this.TILE_SIZE);
        this.dirtTiles3 = this.createTiles(0, 500+(3*this.TILE_SIZE), "dirtTile", 20, this.TILE_SIZE);
        this.backgrounds = this.createTiles(100, 384, "background", 3, 1001);
        this.backgrounds.setTint(0x2ed1a2);

        this.character = this.physics.add.sprite(200, 300, "characterSheet");
        this.character.play("walk");
        this.character.setSize(64,96);
        this.character.setGravityY(200);

        this.obstacles = this.physics.add.group({ immovable: true });
        this.time.addEvent({
            delay: 3000,
            callbackScope:this,
            callback: () => {
                if (this.isPlaying) {
                    var i = Math.random();
                    var obstacleType = (i > 0.5) ? {name: "gear", y: 350} : {name: "fence", y: 436};
                    var obstacle = this.obstacles.create(1200, obstacleType.y, obstacleType.name);
                    this.physics.add.existing(obstacle);
                }
            },
            repeat: -1
        });

        this.clouds = this.physics.add.group({ immovable: true });
        for (var i = 0; i < 5; i++) {
            this.spawnCloud(100+(i*300));
        }

        this.input.keyboard.on("keydown_UP", function (event: any) {
            if (this.isWalking) {
                this.character.setVelocityY(-250);
                this.character.play("jump");
                this.time.addEvent({
                    delay: 100,
                    callback: () => {
                        this.isWalking = false;
                    },
                    callbackScope: this
                })
            }
        }, this);

        this.input.keyboard.on("keydown_DOWN", function (event: any) {
            if (this.isWalking) {
                this.character.play("duck");
                this.character.setSize(64,86);
                this.time.addEvent({
                    delay: 100,
                    callback: () => {
                        this.isWalking = false;
                    },
                    callbackScope: this
                });
                this.time.addEvent({
                    delay: 2500,
                    callback: () => {
                        this.character.play("walk");
                        this.character.setY(this.character.y-5);
                        this.character.setSize(64,96);
                        this.isWalking = true;
                    },
                    callbackScope: this
                });
            }
        }, this);

        this.grassCollider = this.physics.add.collider(this.character, [this.grassTiles]);
        this.obstacleCollider = this.physics.add.collider(this.character, [this.obstacles], this.gameOver, null, this);
    }

    update(time: any): void {
        this.grassTiles.incX(this.groudSpeed);
        this.checkInfiniteLoop(this.grassTiles, this.TILE_SIZE);

        this.dirtTiles1.incX(this.groudSpeed);
        this.checkInfiniteLoop(this.dirtTiles1, this.TILE_SIZE);

        this.dirtTiles2.incX(this.groudSpeed);
        this.checkInfiniteLoop(this.dirtTiles2, this.TILE_SIZE);

        this.dirtTiles3.incX(this.groudSpeed);
        this.checkInfiniteLoop(this.dirtTiles3, this.TILE_SIZE);

        this.backgrounds.incX(0.5*this.groudSpeed);
        this.checkInfiniteLoop(this.backgrounds, 1001);

        this.obstacles.incX(this.groudSpeed);

        this.clouds.incX(0.2*this.groudSpeed);
        this.checkInfiniteLoop(this.clouds, 300)
        
        if (this.character.y == 420 && !this.isWalking) {
            this.isWalking = true;
            this.character.play("walk");
        }
    }

    private createTiles(x: integer, y: integer, image: string, amount: integer, imageWidth: integer): Physics.Arcade.Group {
        var tiles = this.physics.add.group({ immovable : true });
        for (var i = 0; i < amount; i++) {
            var tile = tiles.create(x+(i*imageWidth), y, image);
            this.physics.add.existing(tile);
            tile.body.setImmovable();
        }
        return tiles;
    }

    private checkInfiniteLoop(tiles: Phaser.Physics.Arcade.Group, imageWidth: integer): void {
        var firstTile = tiles.getFirst(true);
        if (firstTile.x <= -(imageWidth/2)) { 
            var lastTile = tiles.getLast(true);
            tiles.remove(firstTile);
            firstTile.setPosition(lastTile.x+imageWidth, firstTile.y);
            tiles.add(firstTile);
        }
    }

    private gameOver(): void {
        this.groudSpeed = 0;
        this.isPlaying = false;
        this.physics.world.removeCollider(this.grassCollider);
        this.physics.world.removeCollider(this.obstacleCollider);
        this.character.play("jump");
        this.character.setVelocityY(-250);
    }

    private spawnCloud(x: integer) {
        var i = this.getRandomInt(9) + 1;
        this.clouds.create(x, 100+(this.getRandomInt(4)*20), "cloud"+i);
    }
    
    private getRandomInt(max: integer): integer {
        return Math.floor(Math.random() * Math.floor(max));
    }
}