import { AddedGameObjects, GameEvent, SnakeAteFood, SnakeDied } from './GameEvents';
import { GameWorld } from './GameWorld';
import { GameObject } from './GameObject';
import {Snake} from './Snake';
import {Dirs, getRandomInt} from './common';

import {CanvasRenderServiceImpl} from './render/CanvasRenderService.Impl';
import {RenderService} from './render/RenderService';
import {FoodService} from './foods/FoodService';

interface GameSettings {
   maxTry: number;
   foodTimeout: { min: number, max: number};
   size: number;
   reduceArea: number;
}

export enum GameStates {
  play = 'play',
  stop = 'stop',
  over = 'over',
}

export class Game {
    private readonly gameWorld = new GameWorld();
    constructor(settings?: GameSettings) {
      this._settings = {...settings, ...this._settings};
      this._size = this._settings.size;
      this._reduceArea  = this._settings.reduceArea / this._size;
      this._foodService = new FoodService();

      window.addEventListener('keydown', (e: KeyboardEvent) => this.arrowControls(e) );
    }
    private _snake: Snake;

    private _render: RenderService;
    private _foodService: FoodService;

    private _state: GameStates = GameStates.stop;
    private _reduceArea = 0;
    private _size: number = 0;
    private _score: number = 0;
    private _prevScore: number = 0;

    get snake(): Snake { return this._snake; }

    get score(): number { return this._score; }
    get prevScore(): number { return this._prevScore; }
    get size(): number { return this._size; }

    get state(): GameStates { return this._state; }
    get objects(): GameObject[] { return this.gameWorld.getObjects(); }

    private _settings: GameSettings = {
        maxTry: 1,
        foodTimeout: {max: 3, min: 1},
        size: 16,
        reduceArea: 112,
    };

    update(): void {
        this._snake.update(1);
        this.gameWorld.getObjects().forEach(o => {
          if (o === this._snake) { return; }
          if (o.x === this._snake.x && o.y === this._snake.y) { this._snake.onCollision(o);}
        });
    }

    render(el: HTMLElement) {
      this._render = new CanvasRenderServiceImpl(el, this);
      this._render.render();
    }

    canRestart() {
      // if (this._try + 1 > this._settings.maxTry) { return false ; }

      return  true;
    }

    newGame() {
        this.gameWorld.clear();

        this._state = GameStates.stop;
        this._score = 0;
        const coords = this.randomCoords();

        this._snake = new Snake(coords.x + 1 , coords.y + 1);
        this.gameWorld.addObject(this._snake);
        this.addFood();
        this.gameWorld.events.on('event', (event) => this.handleEvent(event));
    }

    start() {
      if (this._state === GameStates.stop) {
        this._state = GameStates.play;
      }
    }

    restart() {
      this.newGame();
      this.start();
    }

    private gameOver() {
      this._state = GameStates.over;
    }

    private addFood() {
      const coords = this.randomCoords();
      this.gameWorld.addObject(this._foodService.getFood(coords.x, coords.y));
    }

    private randomCoords() {
      const coords = {
         x: 0, // getRandomInt(this._area.x2, this._area.x1),
         y: 0, // getRandomInt(this._area.y2, this._area.y1),
      };
      return coords;
    }

    private randomFoodTimeout() {
      return getRandomInt(this._settings.foodTimeout.max, this._settings.foodTimeout.min) * 1000;
    }

    private handleEvent(event: GameEvent) {
      if (event instanceof SnakeAteFood) {
        this._score += event.data.food.score;
        this.gameWorld.removeObject(event.data.food);
        this.addFood();
        return;
      }
      if (event instanceof AddedGameObjects) {
        event.data.objects.forEach(o => {
          this.gameWorld.addObject(o);
        });
      }
      if (event instanceof SnakeDied) {
        this.gameOver();
      }
    }

    private arrowControls(e: KeyboardEvent) {
      const keys = [
        { codes: [65, 37], dir: Dirs.left },
        { codes: [87, 38], dir: Dirs.up },
        { codes: [68, 39], dir: Dirs.right },
        { codes: [83, 40], dir: Dirs.down },
      ];
      const key = keys.find( k => k.codes.includes(e.keyCode));
      if ( key  && this._state === GameStates.play) {
          this._snake.dir = key.dir;
          this.update();
      }
    }
}
