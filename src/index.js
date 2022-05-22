import Phaser from "phaser";
import platform from "./assets/platform.jpg";
import red_block from "./assets/red_block.jpg";
import green_block from "./assets/green_block.jpg";
import grey_block from "./assets/grey_block.jpg";
import ball from "./assets/ball.png";

const WIDTH = 1024;
const HEIGHT = 768;
const WORLD_GRAVITY_Y = 0;
const PLATFORM_SPEED = 900;
const PLATFORM_WIDTH = 170;
const PLATFORM_HEIGHT = 10;
const BALL_SIZE = 10;
const BALL_SPEED = 300;

const BLOCK_INFO = Object.freeze({
  width: 10,
  height: 10,
  count: {
    row: 10,
    col: 75,
  },
  offset: {
    top: 50,
    left: 32,
  },
  padding: 3,
});

const PLATFORM_KEY = "platform";
const RED_BLOCK_KEY = "red_block";
const GREEN_BLOCK_KEY = "green_block";
const GREY_BLOCK_KEY = "grey_block";
const BALL_KEY = "ball";

class MyGame extends Phaser.Scene {
  constructor() {
    super();
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
      .sprite(WIDTH / 2, HEIGHT - PLATFORM_HEIGHT / 2, PLATFORM_KEY)
      .setCollideWorldBounds(true);
    this.ball = this.physics.add
      .sprite(WIDTH / 2, HEIGHT - BALL_SIZE / 2 - PLATFORM_HEIGHT, BALL_KEY)
      .setCircle(BALL_SIZE / 2)
      .setCollideWorldBounds(true);
    this.initBlocks();
    this.ball.setBounce(1);
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
  }

  startGame() {
    if (this.ball.body.speed === 0) {
      this.ball.setVelocity(Phaser.Math.Between(-BALL_SPEED, BALL_SPEED), -BALL_SPEED);
      this.physics.add.collider(
        this.ball,
        this.platform,
        () => {
          this.ball.setVelocityY(-BALL_SPEED);
        },
        null,
        this
      );
    }
  }

  initBlocks() {
    this.blocks = this.physics.add.group({
      immovable: true,
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

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  scene: MyGame,
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

const game = new Phaser.Game(config);
