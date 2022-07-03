//додання файзеру
import Phaser from "phaser";

//імпорт асетів
import platform from "./../assets/platform.jpg";
import red_block from "./../assets/red_block.jpg";
import green_block from "./../assets/green_block.jpg";
import grey_block from "./../assets/grey_block.jpg";
import ball from "./../assets/ball.png";

//імпорт констант
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
  LOBBY_SCENE_KEY,
  X_TEXT,
  Y_TEXT,
  SCORE_STEP,
} from "../gameConfigs";

//створення основної сцени
export class Main extends Phaser.Scene {
  constructor() {
    super(MAIN_SCENE_KEY);
  }

  //прелоад картинок асетів
  preload() {
    this.load.image(PLATFORM_KEY, platform);
    this.load.image(RED_BLOCK_KEY, red_block);
    this.load.image(GREEN_BLOCK_KEY, green_block);
    this.load.image(GREY_BLOCK_KEY, grey_block);
    this.load.image(BALL_KEY, ball);
  }

  create() {
    //збереження об'єкту для обробк натскань клавіш
    this.controls = this.input.keyboard.createCursorKeys();

    //опрацювання фізики платформи
    this.platform = this.physics.add
      .sprite(WIDTH / 2, HEIGHT - PLATFORM_HEIGHT / 2, PLATFORM_KEY)
      .setCollideWorldBounds(true)
      .setImmovable(true);

    //опрацювання фізики м'яча
    this.ball = this.physics.add
      .sprite(WIDTH / 2, 180, BALL_KEY)
      .setCircle(BALL_SIZE / 2)
      .setCollideWorldBounds(true);

    //створення блоків
    this.initBlocks();

    //задання відскоків м'яча
    this.ball.setBounce(1);

    //вимкнення колізії нижньої межі сцени
    this.physics.world.checkCollision.down = false;

    //опрацювання натискань кнопки ентер
    this.input.keyboard.on("keydown-ESC", () => this.scene.start(LOBBY_SCENE_KEY));

    //додання рахунки
    this.scoreBoard = this.add
      .text(X_TEXT, Y_TEXT, "Score = 0", { fontSize: "18px", color: "white" })
      .setAlign("center");
    this.score = 0;
  }

  update() {
    //опрацювання натискань клавіш
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

      //створення колайдеру між м'ячем і платформою
      this.physics.add.collider(
        this.ball,
        this.platform,
        (ball) => {
          ball.setVelocityY(-BALL_SPEED);
        },
        null,
        this
      );

      //створення колайдеру між м'ячем і блоками
      this.physics.add.collider(
        this.ball,
        this.blocks,
        (ball, block) => this.blocksColliderHandler(ball, block),
        null,
        this
      );
    }
  }

  //функція для опрацювання зіткнення блоків з м'ячем
  blocksColliderHandler(ball, block) {
    block.disableBody(true, true);
    this.score += SCORE_STEP;
    this.scoreBoard.setText("Points: " + this.score);
    if (ball.body.velocity.y > 0) {
      ball.setVelocityY(-BALL_SPEED);
    } else {
      ball.setVelocityY(BALL_SPEED);
    }
  }

  //функція для припинення гри
  stopGame() {
    if (this.ball.y > HEIGHT - BALL_SIZE / 2) {
      //перехід на сцену гейм-оверу
      this.scene.start(GAME_OVER_SCENE_KEY);
    }
  }

  //налаштування блоків
  initBlocks() {
    this.blocks = this.physics.add.group({
      immovable: true,
    });

    //створення блоків
    for (let i = 0; i < BLOCK_INFO.count.col; i++) {
      for (let u = 0; u < BLOCK_INFO.count.row; u++) {
        const blockX = i * (BLOCK_INFO.width + BLOCK_INFO.padding) + BLOCK_INFO.offset.left;
        const blockY = u * (BLOCK_INFO.height + BLOCK_INFO.padding) + BLOCK_INFO.offset.top;
        this.blocks.create(blockX, blockY, RED_BLOCK_KEY);
      }
    }
  }
}
