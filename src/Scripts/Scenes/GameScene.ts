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
    coins: Phaser.Physics.Arcade.Group;
    character: Phaser.Physics.Arcade.Sprite;
    grassCollider: Phaser.Physics.Arcade.Collider;
    obstacleCollider: Phaser.Physics.Arcade.Collider;
    jumpSound: Phaser.Sound.BaseSound;
    coinSound: Phaser.Sound.BaseSound;
    scoreText: Phaser.GameObjects.Text;
    fpsText: Phaser.GameObjects.Text;
    isWalking: boolean;
    groudSpeed: integer;
    TILE_SIZE: integer;
    isPlaying: boolean;
    score: integer;

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
        this.score = 0;
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

        this.jumpSound = this.sound.add("jump");
        this.coinSound = this.sound.add("coinSound");

        this.grassTiles = this.createTiles(0, 500, "grassTile", 20, this.TILE_SIZE);
        this.dirtTiles1 = this.createTiles(0, 500+(this.TILE_SIZE), "dirtTile", 20, this.TILE_SIZE);
        this.dirtTiles2 = this.createTiles(0, 500+(2*this.TILE_SIZE), "dirtTile", 20, this.TILE_SIZE);
        this.dirtTiles3 = this.createTiles(0, 500+(3*this.TILE_SIZE), "dirtTile", 20, this.TILE_SIZE);
        this.backgrounds = this.createTiles(100, 384, "background", 3, 1001);
        this.backgrounds.setTint(0x2ed1a2);

        this.clouds = this.physics.add.group({ immovable: true });
        for (var i = 0; i < 5; i++) {
            this.spawnCloud(100+(i*300));
        }

        this.character = this.physics.add.sprite(200, 300, "characterSheet");
        this.character.play("walk");
        this.character.setSize(64,96);
        this.character.setGravityY(200);

        this.obstacles = this.physics.add.group({ immovable: true });
        this.coins = this.physics.add.group({ immovable: true });
        this.time.addEvent({
            delay: 3000,
            callbackScope:this,
            callback: () => {
                if (this.isPlaying) {
                    var i = Math.random();
                    if (i > 0.8) {
                        var coin = this.coins.create(1300, 300, "coin");
                        this.physics.add.existing(coin);
                    } else {
                        var obstacleType = (i > 0.4) ? {name: "gear", y: 350} : {name: "fence", y: 436};
                        var obstacle = this.obstacles.create(1300, obstacleType.y, obstacleType.name);
                        this.physics.add.existing(obstacle);
                    }
                }
            },
            repeat: -1,
            startAt: 2000
        });

        this.scoreText = this.add.text(600, 50, "" + this.score, { 
            fontFamily: "Roboto Condensed", 
            color: "#000",
            fontSize: "64px" 
        });
        this.scoreText.setOrigin(0.5);
        
        this.fpsText = this.add.text(0, 0, "fps: " + this.game.loop.actualFps, {
            fontFamily: "Roboto Condensed",
            color: "#000",
        });

        this.add.text(10,25,"Up Arrow - Jump", { fontFamily: "Roboto Condensed", color: "#000", fontSize: "32px"});
        this.add.text(10,60,"Down Arrow - Duck", { fontFamily: "Roboto Condensed", color: "#000", fontSize: "32px"});

        this.input.keyboard.on("keydown_UP", function (event: any) {
            if (this.isWalking) {
                this.character.setVelocityY(-250);
                this.character.play("jump");
                this.jumpSound.play();
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
                this.character.setY(this.character.y+5);
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
        
        this.input.keyboard.on("keydown_R", function (event: any) {
            if (!this.isPlaying) {
                this.scene.start("GameScene");
            }
        }, this);

        this.time.addEvent({
            delay: 1000,
            callbackScope: this,
            repeat: -1,
            callback: () => {
                if (this.isPlaying) {
                    this.score += 100;
                }
            }
        });

        this.grassCollider = this.physics.add.collider(this.character, [this.grassTiles]);
        this.obstacleCollider = this.physics.add.collider(this.character, [this.obstacles], this.gameOver, null, this);
        this.physics.add.overlap(this.character, [this.coins], this.getCoin, null, this);
    }

    update(time: any): void {
        this.scoreText.setText("" + this.score).setX(600);
        this.fpsText.setText("fps: " + Math.floor(this.game.loop.actualFps));

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
        this.coins.incX(this.groudSpeed);
        this.checkForUnusedObject(this.obstacles);
        this.checkForUnusedObject(this.coins);

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
        this.add.text(0, 0, "Game Over\n\nPress R to Restart", {
            fontFamily: "Roboto Condensed",
            fontSize: "64px",
            color: "#000",
            align: "center"
        }).setOrigin(0.5).setPosition(600, 250);
    }

    private spawnCloud(x: integer): void {
        var i = this.getRandomInt(9) + 1;
        this.clouds.create(x, 100+(this.getRandomInt(4)*20), "cloud"+i);
    }
    
    private getRandomInt(max: integer): integer {
        return Math.floor(Math.random() * Math.floor(max));
    }

    private getCoin(character: any, coin: any): void {
        coin.destroy();
        this.coinSound.play()
        this.score += 150;
    }

    private checkForUnusedObject(group: Phaser.Physics.Arcade.Group) {
        var child = group.getFirst(true);
        if (child && child.x < -100) {
            child.destroy();
        }
    }
}