import { BootScene } from "./scenes/BootScene.js";
import { CoverScene } from "./scenes/CoverScene.js";

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 1920,
  height: 1080,
  backgroundColor: "#0b1220",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, CoverScene],
};

window.game = new Phaser.Game(config);
