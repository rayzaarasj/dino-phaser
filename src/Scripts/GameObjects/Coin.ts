import "phaser";
import { GameScene } from "../Scenes/GameScene";

export class Coin extends Phaser.Physics.Arcade.Image {
  constructor(config: any) {
    super(config.scene, 1300, 300, "coin");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.scene.events.on("update", (time: any, delta: any) => {
      this.update(time, delta);
    });
  }

  onCollide() {
    (this.scene as GameScene).getCoin();
    this.destroy();
  }

  update(time: any, delta: any) {
    if (this.x < -100) {
      this.destroy();
    }
  }
}
