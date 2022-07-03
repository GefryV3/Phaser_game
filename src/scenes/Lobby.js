//імпорт файзеру
import Phaser from "phaser";

//імпорт асетів кнопок
import start_button from "./../assets/start_button.jpg";
import best_score_button from "./../assets/best_score_button.jpg";
import mute_button from "./../assets/mute_button.jpg";

//імпорт активних асетів кнопок
import start_button_active from "./../assets/start_button_active.jpg";
import best_score_button_active from "./../assets/best_score_button_active.jpg";
import mute_button_active from "./../assets/mute_button_active.jpg";

//імпорт констант
import {
  BEST_SCORE_BUTTON_KEY,
  MUTE_BUTTON_KEY,
  START_BUTTON_KEY,
  START_BUTTON_ACTIVE_KEY,
  BEST_SCORE_BUTTON_ACTIVE_KEY,
  MUTE_BUTTON_ACTIVE_KEY,
  MAIN_FONT_STYLE,
  LOBBY_SCENE_KEY,
  WIDTH,
  HEIGHT,
  MAIN_SCENE_KEY,
} from "../gameConfigs";

//створення констант розмірів кнопок
const BUTTON_HEIGHT = 60;
const BUTTON_MARGIN = 20;

//створення сцени лоббі
export class Lobby extends Phaser.Scene {
  constructor() {
    super(LOBBY_SCENE_KEY);
  }

  preload() {
    this.load.image(START_BUTTON_KEY, start_button);
    this.load.image(BEST_SCORE_BUTTON_KEY, best_score_button);
    this.load.image(MUTE_BUTTON_KEY, mute_button);
    this.load.image(START_BUTTON_ACTIVE_KEY, start_button_active);
    this.load.image(BEST_SCORE_BUTTON_ACTIVE_KEY, best_score_button_active);
    this.load.image(MUTE_BUTTON_ACTIVE_KEY, mute_button_active);
  }

  create() {
    this.controls = this.input.keyboard.createCursorKeys();

    //додання назви
    this.add
      .text(WIDTH * 0.5, HEIGHT * 0.1, "Block game", MAIN_FONT_STYLE)
      .setAlign("center")
      .setOrigin(0.5);

      // додання підказки про вибір кнопки
    this.add
      .text(WIDTH * 0.5, HEIGHT * 0.9, "Press ENTER to select", { ...MAIN_FONT_STYLE, fontSize: "20px" })
      .setAlign("center")
      .setOrigin(0.5);

      //створення масиву для кнопок
    this.buttons = [];

    //створення логіки роботи кнопки старту
    const startButton = new LobbyButton(START_BUTTON_KEY, START_BUTTON_ACTIVE_KEY);
    startButton.sprite = this.add.sprite(WIDTH * 0.5, HEIGHT * 0.3, START_BUTTON_ACTIVE_KEY);
    startButton.setAction(() => this.scene.start(MAIN_SCENE_KEY));
    this.buttons.push(startButton);

    //створення логіки роботи кнопки кращого рахунку
    const bestScoreButton = new LobbyButton(BEST_SCORE_BUTTON_KEY, BEST_SCORE_BUTTON_ACTIVE_KEY);
    bestScoreButton.sprite = this.add.sprite(
      WIDTH * 0.5,
      startButton.sprite.y + BUTTON_HEIGHT + BUTTON_MARGIN,
      BEST_SCORE_BUTTON_KEY
    );
    bestScoreButton.setAction(() => console.log("*переход на сцену с бест скором*"));
    this.buttons.push(bestScoreButton);
    
    //ствроення логіки роботи кнопки муту
    const muteButton = new LobbyButton(MUTE_BUTTON_KEY, MUTE_BUTTON_ACTIVE_KEY);
    muteButton.sprite = this.add.sprite(
      WIDTH * 0.5,
      bestScoreButton.sprite.y + BUTTON_HEIGHT + BUTTON_MARGIN,
      MUTE_BUTTON_KEY
    );
    muteButton.setAction(() => console.log("*выключение звука*"));
    this.buttons.push(muteButton);

    //додання роботи ентеру
    this.input.keyboard.on("keydown-ENTER", () => this.getActiveButton().callAction());

    //створення змінної для активної кнопки
    this.activeButtonIndex = 0;
  }

  update() {
    //додання праці кнопок вверх і вниз
    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.controls.up);
    const downJustPressed = Phaser.Input.Keyboard.JustDown(this.controls.down);
    // const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.controls.space);

    //опрацювання натискання кнопки вгору
    if (upJustPressed) {
      this.nextActiveIndex(-1);
    } else if (downJustPressed) {
      this.nextActiveIndex(1);
    }
    // } else if (spaceJustPressed) {
    //   this.getActiveButton().callAction();
    // }
  }

  //функція для повернення активної кнопки
  getActiveButton() {
    return this.buttons[this.activeButtonIndex];
  }

  //функція для опрацювання активної кнопки
  nextActiveIndex(change) {
    const index = this.activeButtonIndex + change;
    if (index > this.buttons.length - 1) {
      this.activeButtonIndex = 0;
    } else if (index < 0) {
      this.activeButtonIndex = this.buttons.length - 1;
    } else {
      this.activeButtonIndex = index;
    }

    this.updateButtonSkin();
  }

  //функція для зміну зрвнішнього вигляду активної кнопки
  updateButtonSkin() {
    this.buttons.forEach((button, index) => {
      const isActiveButton = index === this.activeButtonIndex;
      button.sprite.setTexture(isActiveButton ? button.textureActiveKey : button.textureKey);
    });
  }
}

class LobbyButton {
  //класс кнопки лоббі
  constructor(textureKey, textureActiveKey) {

    //назва кнопки
    this.name = textureKey;

    //ключ текстури кнопки в звичайному режимі
    this.textureKey = textureKey;

    //ключ текстури кнопки в активному режимі
    this.textureActiveKey = textureActiveKey;

    //об'єкт кнопки в файзері
    this.sprite = null;

    //дія кнопки
    this.action = () => null;
  }

  //задає дію для кнопки
  setAction(func) {
    if (typeof func === "function") {
      this.action = func;
    } else {
      throw new TypeError("parametr in setAction is not function");
    }
  }

  //виклик дії
  callAction() {
    return this.action();
  }
}