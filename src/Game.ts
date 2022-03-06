import {Snake} from './Snake2';
import {Dirs, getRandomInt} from './common';
import {Area} from './Area';
import {CanvasRenderServiceImpl} from './render/CanvasRenderService.Impl';
import {RenderService} from './render/RenderService';
import {FoodService} from './foods/FoodService';
import {Food} from './foods/Foods';
import {GameObject} from './GameObject';

interface GameSettings {
   maxTry: number;
   foodTimeout: { min: number, max: number};
   gameArea: { w: number, h: number};
   size: number;
   reduceArea: number;
}

export enum GameStates {
  play = 'play',
  stop = 'stop',
  over = 'over',
}

export class Game {
    constructor(settings?: GameSettings) {
      this._settings = {...settings, ...this._settings};

      this._foodSevice = new FoodService();

      window.addEventListener('keydown', (e: KeyboardEvent) => this.arrowControls(e) );
    }
    private _snake: Snake;
    private _area: Area;
    private _foods: Food[];

    private _lastUpdate: number = Date.now();
    private _foodTimer: number;
    private _render: RenderService;
    private _foodSevice: FoodService;

    private _state: GameStates = GameStates.stop;
    private _reduceArea = 0;

    private _settings: GameSettings = {
        maxTry: 1,
        foodTimeout: {max: 8, min: 4},
        gameArea: { h: 800, w: 800 },
        size: 16,
        reduceArea: 112,
    };

    update(): void {
        const delta = Date.now() - this._lastUpdate;
        this._lastUpdate = Date.now();
        this._snake.update(delta);
        this.updateTimers(delta);
    }

    updateTimers(delta: number) {
        if (this._foodTimer !== undefined) {
            this._foodTimer -= delta;
            if (this._foodTimer <= 0) {
                this.addFood();
                this._foodTimer = undefined;
            }
        }
    }
    get snake(): Snake { return this._snake; }
    get foods(): Food[] { return this._foods; }
    get area(): Area { return this._area; }

    get score(): number { return this._score; }
    get prevScore(): number { return this._prevScore; }
    get size(): number { return this._size; }





    get state(): GameStates { return this._state; }

    render(el: HTMLElement) {
      this._render = new CanvasRenderServiceImpl(el, this);
      this._render.render();
    }

    canRestart() {
      // if (this._try + 1 > this._settings.maxTry) { return false ; }

      return  true;
    }

    newGame() {
        this._state = GameStates.stop;

        // this._score = 0;
        const coords = this.randomCoords();
        this._snake = new Snake(coords.x, coords.y);
        this.addFood();
    }

    start() {
      if (this._state === GameStates.stop) {
        this._state = GameStates.play;
      }
    }

    restart() {
      if (!this.canRestart()) { return false ; }
      this.newGame();
      this.start();
    }

    private gameOver() {
      this._state = GameStates.over;
    }

    private addFood() {
      const coords = this.randomCoords();
      this._foods.push(this._foodService.getFood(coords.x, coords.y));
    }

    private randomCoords() {
      const coords = {
        // x: getRandomInt(this._area.x2, this._area.x1),
        // y: getRandomInt(this._area.y2, this._area.y1),
      };
      return coords;
    }

    private randomFoodTimeout() {
      return getRandomInt(this._settings.foodTimeout.max, this._settings.foodTimeout.min) * 1000;
    }

    'SnakeEatFood'
    this._foodTimer = 1000;
    this._

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
      }
    }
}
