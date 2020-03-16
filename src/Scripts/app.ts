import "phaser";
import { GameScene } from "./Scenes/GameScene";

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 300;

const config: Phaser.Types.Core.GameConfig = {
  title: "Tap Rush",
  scale: {
    parent: "game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  physics: {
      default: "arcade",
      arcade: {
          debug: false
      }
  },
  backgroundColor: "#87ceeb",
  scene: [GameScene]
};
export class DinoGame extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}
window.onload = () => {
  var game = new DinoGame(config);
};