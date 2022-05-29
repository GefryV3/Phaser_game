import Phaser from "phaser";

import { WIDTH, HEIGHT, MAIN_SCENE_KEY, GAME_OVER_SCENE_KEY } from "../gameConfigs" 


export class GameOver extends Phaser.Scene {
    constructor() {
      super(GAME_OVER_SCENE_KEY);
    }
    create() {
      this.controls = this.input.keyboard.createCursorKeys();
      this.add
      .text(WIDTH/2, HEIGHT/2, ["Game over", "Press SPACE to restart game"], {fontSize:"50px", color:"white"})
      .setAlign("center")
      .setOrigin(0.5);
    }
  
    update() {
      if(this.controls.space.isDown) {
        this.scene.start(MAIN_SCENE_KEY);
      }
    }
  }