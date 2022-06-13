import Phaser from "phaser";
import { GameOver } from "./scenes/GameOver";
import { Main } from "./scenes/Main";
import { Lobby } from "./scenes/Lobby";
import { WIDTH, HEIGHT, WORLD_GRAVITY_Y } from "./gameConfigs";

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  scene: [Lobby,Main,GameOver],
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: WORLD_GRAVITY_Y,
      },
      // debug:true
    },
  },
};

new Phaser.Game(config);