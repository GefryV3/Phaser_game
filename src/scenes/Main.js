import Phaser from "phaser";
import platform from "./../assets/platform.jpg";
import red_block from "./../assets/red_block.jpg";
import green_block from "./../assets/green_block.jpg";
import grey_block from "./../assets/grey_block.jpg";
import ball from "./../assets/ball.png";

import {
  WIDTH,
  HEIGHT,
  PLATFORM_KEY,
  BALL_KEY,
  RED_BLOCK_KEY,
  GREEN_BLOCK_KEY,
  GREY_BLOCK_KEY,
  BALL_SIZE,
  PLATFORM_HEIGHT,
  PLATFORM_SPEED,
  BALL_SPEED,
  GAME_OVER_SCENE_KEY,
  BLOCK_INFO,
  MAIN_SCENE_KEY,
} from "../gameConfigs";

export class Main extends Phaser.Scene {
  constructor() {
    super(MAIN_SCENE_KEY);
  }

  preload() {
    this.load.image(PLATFORM_KEY, platform);
    this.load.image(RED_BLOCK_KEY, red_block);
    this.load.image(GREEN_BLOCK_KEY, green_block);
    this.load.image(GREY_BLOCK_KEY, grey_block);
    this.load.image(BALL_KEY, ball);
  }

  create() {
    this.controls = this.input.keyboard.createCursorKeys();
    this.platform = this.physics.add
      .sprite(WIDTH / 2, HEIGHT - PLATFORM_HEIGHT/2, PLATFORM_KEY)
      .setCollideWorldBounds(true)
      .setImmovable(true);
    this.ball = this.physics.add
      .sprite(WIDTH / 2, 180, BALL_KEY)
      .setCircle(BALL_SIZE / 2)
      .setCollideWorldBounds(true);
    this.initBlocks();
    this.ball.setBounce(1);
    this.physics.world.checkCollision.down = false;
  }

  update() {
    if (this.controls.left.isDown) {
      this.platform.setVelocityX(-PLATFORM_SPEED);
      this.startGame();
    } else if (this.controls.right.isDown) {
      this.platform.setVelocityX(PLATFORM_SPEED);
      this.startGame();
    } else {
      this.platform.setVelocityX(0);
    }

    this.stopGame();
  }

  startGame() {
    if (this.ball.body.speed === 0) {
      this.ball.setVelocity(Phaser.Math.Between(-BALL_SPEED, BALL_SPEED), -BALL_SPEED);
      this.physics.add.collider(
        this.ball,
        this.platform,
        (ball) => {
          ball.setVelocityY(-BALL_SPEED);
        },
        null,
        this
      )
      this.physics.add.collider(this.ball, this.blocks, (ball, block) => {
        alert(ball.body.velocity.y);
        block.disableBody(true, true);
        if(ball.body.velocity.y > 0) {
            ball.setVelocityY(-BALL_SPEED);
        } else{
            ball.setVelocityY(BALL_SPEED);
        }
      }, null, this)
    }
  }

  stopGame() {
    if (this.ball.y > HEIGHT - BALL_SIZE / 2) {
      this.scene.start(GAME_OVER_SCENE_KEY);
    }
  }

  initBlocks() {
    this.blocks = this.physics.add.group({
      immovable: true,
    //   key: RED_BLOCK_KEY,
    //   repeat: BLOCK_INFO.count.col,
    //   setXY: {
    //       x: BLOCK_INFO.offset.left,
    //       y: BLOCK_INFO.offset.top,
    //       stepX: BLOCK_INFO.width + BLOCK_INFO.padding,
    //   }
    });

    for (let i = 0; i < BLOCK_INFO.count.col; i++) {
      for (let u = 0; u < BLOCK_INFO.count.row; u++) {
        const blockX = i * (BLOCK_INFO.width + BLOCK_INFO.padding) + BLOCK_INFO.offset.left;
        const blockY = u * (BLOCK_INFO.height + BLOCK_INFO.padding) + BLOCK_INFO.offset.top;
        this.blocks.create(blockX, blockY, RED_BLOCK_KEY);
      }
    }
  }
}
