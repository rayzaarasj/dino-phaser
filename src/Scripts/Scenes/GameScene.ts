import "phaser";
import { Character } from "../GameObjects/Character";
import { Fence } from "../GameObjects/Fence";
import { Gear } from "../GameObjects/Gear";
import { Coin } from "../GameObjects/Coin";

export class GameScene extends Phaser.Scene {
  grassTiles: Phaser.Physics.Arcade.Group;
  dirtTiles1: Phaser.Physics.Arcade.Group;
  dirtTiles2: Phaser.Physics.Arcade.Group;
  dirtTiles3: Phaser.Physics.Arcade.Group;
  interactables: Phaser.Physics.Arcade.Group;
  backgrounds: Phaser.Physics.Arcade.Group;
  clouds: Phaser.Physics.Arcade.Group;
  character: Phaser.Physics.Arcade.Sprite;
  grassCollider: Phaser.Physics.Arcade.Collider;
  obstacleCollider: Phaser.Physics.Arcade.Collider;
  jumpSound: Phaser.Sound.BaseSound;
  coinSound: Phaser.Sound.BaseSound;
  scoreText: Phaser.GameObjects.Text;
  fpsText: Phaser.GameObjects.Text;
  groudSpeed: integer;
  TILE_SIZE: integer;
  isPlaying: boolean;
  score: integer;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(): void {
    this.groudSpeed = -3;
    this.TILE_SIZE = 64;
    this.isPlaying = true;
    this.score = 0;
  }

  create(): void {
    this.jumpSound = this.sound.add("jump");
    this.coinSound = this.sound.add("coinSound");

    this.grassTiles = this.createTiles(0, 500, "grassTile", 20, this.TILE_SIZE);
    this.dirtTiles1 = this.createTiles(
      0,
      500 + this.TILE_SIZE,
      "dirtTile",
      20,
      this.TILE_SIZE
    );
    this.dirtTiles2 = this.createTiles(
      0,
      500 + 2 * this.TILE_SIZE,
      "dirtTile",
      20,
      this.TILE_SIZE
    );
    this.dirtTiles3 = this.createTiles(
      0,
      500 + 3 * this.TILE_SIZE,
      "dirtTile",
      20,
      this.TILE_SIZE
    );
    this.backgrounds = this.createTiles(100, 384, "background", 3, 1001);
    this.backgrounds.setTint(0x2ed1a2);

    this.clouds = this.physics.add.group({ immovable: true });
    for (var i = 0; i < 5; i++) {
      this.spawnCloud(100 + i * 300);
    }

    this.character = new Character({ scene: this, x: 200, y: 300 });

    this.interactables = this.physics.add.group({ immovable: true });
    this.time.addEvent({
      delay: 3000,
      callbackScope: this,
      callback: () => {
        if (this.isPlaying) {
          var i = Math.random();
          var interactable: Phaser.GameObjects.GameObject;
          if (i > 0.8) {
            interactable = new Coin({ scene: this });
          } else if (i > 0.4) {
            interactable = new Gear({ scene: this });
          } else {
            interactable = new Fence({ scene: this });
          }
          this.interactables.add(interactable);
        }
      },
      repeat: -1,
      startAt: 2999,
    });

    this.scoreText = this.add
      .text(600, 50, "" + this.score, {
        fontFamily: "Roboto Condensed",
        color: "#000",
        fontSize: "64px",
      })
      .setOrigin(0.5);

    this.fpsText = this.add.text(0, 0, "fps: " + this.game.loop.actualFps, {
      fontFamily: "Roboto Condensed",
      color: "#000",
    });

    this.add.text(10, 25, "Up Arrow - Jump", {
      fontFamily: "Roboto Condensed",
      color: "#000",
      fontSize: "32px",
    });
    this.add.text(10, 60, "Down Arrow - Duck", {
      fontFamily: "Roboto Condensed",
      color: "#000",
      fontSize: "32px",
    });

    this.input.keyboard.on(
      "keydown_R",
      function (event: any) {
        if (!this.isPlaying) {
          this.scene.start("GameScene");
        }
      },
      this
    );

    this.time.addEvent({
      delay: 1000,
      callbackScope: this,
      repeat: -1,
      callback: () => {
        if (this.isPlaying) {
          this.score += 100;
        }
      },
    });

    this.grassCollider = this.physics.add.collider(this.character, [
      this.grassTiles,
    ]);
    this.obstacleCollider = this.physics.add.collider(
      this.character,
      [this.interactables],
      function (character: any, obstacle: any) {
        obstacle.onCollide();
      },
      null,
      this
    );
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

    this.backgrounds.incX(0.5 * this.groudSpeed);
    this.checkInfiniteLoop(this.backgrounds, 1001);

    this.interactables.incX(this.groudSpeed);

    this.clouds.incX(0.2 * this.groudSpeed);
    this.checkInfiniteLoop(this.clouds, 300);
  }

  private createTiles(
    x: integer,
    y: integer,
    image: string,
    amount: integer,
    imageWidth: integer
  ): Phaser.Physics.Arcade.Group {
    var tiles = this.physics.add.group({ immovable: true });
    for (var i = 0; i < amount; i++) {
      var tile = tiles.create(x + i * imageWidth, y, image);
      this.physics.add.existing(tile);
      tile.body.setImmovable();
    }
    return tiles;
  }

  private checkInfiniteLoop(
    tiles: Phaser.Physics.Arcade.Group,
    imageWidth: integer
  ): void {
    var firstTile = tiles.getFirst(true);
    if (firstTile.x <= -(imageWidth / 2)) {
      var lastTile = tiles.getLast(true);
      tiles.remove(firstTile);
      firstTile.setPosition(lastTile.x + imageWidth, firstTile.y);
      tiles.add(firstTile);
    }
  }

  gameOver(): void {
    this.groudSpeed = 0;
    this.isPlaying = false;
    this.physics.world.removeCollider(this.grassCollider);
    this.physics.world.removeCollider(this.obstacleCollider);
    this.character.play("jump");
    this.character.setVelocityY(-250);
    this.add
      .text(0, 0, "Game Over\n\nPress R to Restart", {
        fontFamily: "Roboto Condensed",
        fontSize: "64px",
        color: "#000",
        align: "center",
      })
      .setOrigin(0.5)
      .setPosition(600, 250);
  }

  private spawnCloud(x: integer): void {
    var i = this.getRandomInt(9) + 1;
    this.clouds.create(x, 100 + this.getRandomInt(4) * 20, "cloud" + i);
  }

  private getRandomInt(max: integer): integer {
    return Math.floor(Math.random() * Math.floor(max));
  }

  getCoin(): void {
    this.coinSound.play();
    this.score += 150;
  }
}
