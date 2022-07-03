//підключення файзеру
import Phaser from "phaser";

//іморт констант
import { WIDTH, HEIGHT, MAIN_SCENE_KEY, GAME_OVER_SCENE_KEY,MAIN_FONT_STYLE } from "../gameConfigs" 

//створення сцени гейм-овверу
export class GameOver extends Phaser.Scene {
    constructor() {
      super(GAME_OVER_SCENE_KEY);
    }
    create() {
      this.controls = this.input.keyboard.createCursorKeys();
      
      this.add
      .text(WIDTH/2, HEIGHT/2, ["Game over", "Press SPACE to restart game"], MAIN_FONT_STYLE)
      .setAlign("center")
      .setOrigin(0.5);
    }
  
    update() {
      if(this.controls.space.isDown) {
        this.scene.start(MAIN_SCENE_KEY);
      }
    }
  }