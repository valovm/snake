import { Dirs, getRandomInt } from './common';

import { GameCollisionChecker } from './GameCollisionChecker';
import { AddedGameObjects, GameEvent, SnakeAteFood, SnakeDied } from './GameEvents';
import { GameObject } from './GameObject';
import { FoodService } from './gameObjects/foods/FoodService';
import { Rock } from './gameObjects/Rock';
import { GameWorld } from './GameWorld';
import { Snake } from './Snake';

interface GameSettings {
  cols: number;
  rows: number;

}
export enum GameStates {
  play = 'play',
  stop = 'stop',
  over = 'over',
}

export class Game {
  private readonly _defaultSettings: GameSettings = {
    cols: 50,
    rows: 30,
  };

  private readonly _checker: GameCollisionChecker;
  private readonly _gameWorld: GameWorld;
  private readonly _foodService: FoodService;
  private _gameTimer: any;

  private _snake: Snake;
  private _state: GameStates = GameStates.stop;

  private _score: number = 0;
  private readonly _scores: number[] = [];

  private _settings: GameSettings;

  constructor(settings?: GameSettings) {
    this._settings = { ...settings, ...this._defaultSettings };
    this._foodService = new FoodService();
    this._checker = new GameCollisionChecker();
    this._gameWorld = new GameWorld();
    this._gameWorld.events.on('event', (event) => this.handleEvent(event));
  }

  get snake(): Snake { return this._snake; }
  get score(): number { return this._score; }
  get scores(): number[] { return this._scores; }
  get state(): GameStates { return this._state; }
  get objects(): GameObject[] { return  this._gameWorld.getObjects(); }
  get size() {
    return  {
      cols: this._settings.cols,
      rows: this._settings.rows,
    };
  }

  update(): void {
    this._snake.update(1);
    this._checker.checkCollisions(this._snake, this._gameWorld.getObjects());
  }

  newGame() {
    this._gameWorld.clear();
    this._state = GameStates.stop;
    this._score = 0;

    this.addBorders();
    this.addSnake();
    this.addFood();
  }

  start() {
    this._state = GameStates.play;
    this._gameTimer = setInterval(() => { this.update(); }, 500);
  }

  restart() {
    this.newGame();
    this.start();
  }
  private gameOver() {
    clearInterval(this._gameTimer);
    this._scores.push(this._score);
    this._state = GameStates.over;
  }

  handlerKey(keyCode: number) {
    if (this._state !== GameStates.play) { return; }
    const actions = {
      SnakeUp: () => { this._snake.dir = Dirs.up; },
      SnakeDown: () => { this._snake.dir = Dirs.down; },
      SnakeLeft: () => { this._snake.dir = Dirs.left; },
      SnakeRight: () => { this._snake.dir = Dirs.right; },
    };
    const keys = [
      { codes: [65, 37], action: actions.SnakeLeft },
      { codes: [68, 39], action: actions.SnakeRight },
      { codes: [87, 38], action: actions.SnakeUp },
      { codes: [83, 40], action: actions.SnakeDown },
    ];
    const key = keys.find( k => k.codes.includes(keyCode));
    if (key) { key.action(); this.update(); }
  }

  private addBorders() {
    this._gameWorld.addObject(new Rock(0, 0, this.size.cols, 1));
    this._gameWorld.addObject(new Rock(0, 0, 1, this.size.rows));
    this._gameWorld.addObject(new Rock(this.size.cols - 1, 0, 1, this.size.rows));
    this._gameWorld.addObject(new Rock(0, this.size.rows - 1, this.size.cols, 1));
    this._gameWorld.addObject(new Rock(5, 5, 4, 4));
  }
  private addFood() {
    let food;
    do {
      const coords = this.randomCoords();
      food = this._foodService.getFood(coords.x, coords.y);
    } while (this._checker.haveCollisions(food, this._gameWorld.getObjects()));

    this._gameWorld.addObject(food);
  }
  private addSnake() {
    let snake;
    do {
      const coords = this.randomCoords();
      snake = new Snake(coords.x, coords.y);
    } while (this._checker.haveCollisions(snake, this._gameWorld.getObjects()));
    this._snake = snake;
    this._gameWorld.addObject(this._snake);
  }

  private randomCoords() {
    const coords = {
      x: getRandomInt(this.size.cols - 1, 0),
      y: getRandomInt(this.size.rows - 1, 0),
    };
    return coords;
  }

  private handleEvent(event: GameEvent) {
    if (event instanceof SnakeAteFood) {
      this._score += event.data.food.score;
      this._gameWorld.removeObject(event.data.food);
      this.addFood();
      return;
    }
    if (event instanceof AddedGameObjects) {
      event.data.objects.forEach(o => {
        this._gameWorld.addObject(o);
      });
    }
    if (event instanceof SnakeDied) {
      this.gameOver();
    }
  }
}
