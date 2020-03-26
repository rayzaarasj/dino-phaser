import "phaser";
import { GameScene } from "../Scenes/GameScene";

export class Gear extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, 1300, 350, "gear");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.scene.events.on("update", (time: any, delta: any) => {
      this.update(time, delta);
    });
  }

  onCollide() {
    (this.scene as GameScene).gameOver();
  }

  update(time: any, delta: any) {
    this.setRotation(this.rotation - 0.1);
    if (this.x < -100) {
      this.destroy();
    }
  }
}
