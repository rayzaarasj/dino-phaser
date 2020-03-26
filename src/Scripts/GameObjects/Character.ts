import "phaser";

export class Character extends Phaser.Physics.Arcade.Sprite {
  isWalking: boolean = false;

  constructor(config: any) {
    super(config.scene, config.x, config.y, "character");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.scene.anims.create({
      key: "walk",
      frames: this.scene.anims.generateFrameNumbers("character", {
        start: 2,
        end: 3
      }),
      frameRate: 6,
      repeat: -1
    });

    this.scene.anims.create({
      key: "jump",
      frames: this.scene.anims.generateFrameNumbers("character", {
        frames: [2, 7]
      }),
      frameRate: 2,
      repeat: 0
    });

    this.scene.anims.create({
      key: "duck",
      frames: this.scene.anims.generateFrameNumbers("character", {
        frames: [6]
      }),
      frameRate: 1,
      repeat: 0
    });

    this.play("walk");
    this.setSize(64, 96);
    this.setGravityY(200);

    this.scene.input.keyboard.on(
      "keydown_UP",
      function(event: any) {
        if (this.isWalking) {
          this.setVelocityY(-250);
          this.play("jump");
          this.scene.jumpSound.play();
          this.scene.time.addEvent({
            delay: 100,
            callback: () => {
              this.isWalking = false;
            },
            callbackScope: this
          });
        }
      },
      this
    );

    this.scene.input.keyboard.on(
      "keydown_DOWN",
      function(event: any) {
        if (this.isWalking) {
          this.play("duck");
          this.setSize(64, 86);
          this.setY(this.y + 5);
          this.scene.time.addEvent({
            delay: 100,
            callback: () => {
              this.isWalking = false;
            },
            callbackScope: this
          });
          this.scene.time.addEvent({
            delay: 2500,
            callback: () => {
              this.play("walk");
              this.setY(this.y - 5);
              this.setSize(64, 96);
              this.isWalking = true;
            },
            callbackScope: this
          });
        }
      },
      this
    );

    this.scene.events.on("update", (time: any, delta: any) => {
      this.update(time, delta);
    });
  }

  update(time: any, delta: any): void {
    if (this.y == 420 && !this.isWalking) {
      this.isWalking = true;
      this.play("walk");
    }
  }
}
