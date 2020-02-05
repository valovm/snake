
import {Snake} from './Snake';
import {Dirs, getRandomInt, reverseSide, Sides} from './common';
import {Area} from './Area';
import {CanvasRenderServiceImpl} from './render/CanvasRenderService.Impl';
import {RenderService} from './render/RenderService';
import {FoodService} from './foods/FoodService';
import {Food} from './foods/Foods';

interface GameSettings {
   maxTry: number;
   foodTimeout: { min: number, max: number};
   gameArea: { w: number, h: number};
   size: number;
   reduceArea: number;
}

export class Game {
    constructor(el: HTMLCanvasElement, settings?: GameSettings) {
        this._settings = {...settings, ...this._settings};
        this._size = this._settings.size;
        this._reduceArea  = this._settings.reduceArea / this._size;

        this._foodService = new FoodService();

        this._area = new Area(0, this._settings.gameArea.w / this._size ,
                              0, this._settings.gameArea.h / this._size);

        this._render = new CanvasRenderServiceImpl(el, this);
        this._render.render();

        window.addEventListener('keydown', (e: KeyboardEvent) => this.arrowControls(e) );
    }

    private _render: RenderService;
    private _area: Area;
    private _snake: Snake;
    private _food: Food[] = [];
    private _foodService: FoodService;

    private _state: 'stop' | 'play' = 'stop';
    private _score: number = 0;
    private _try: number = 0;
    private _speed: number = 200;
    private _size: number = 0;
    private _timer: any;
    private _reduceArea = 0;

    private readonly _settings: GameSettings = {
        maxTry: 1,
        foodTimeout: {max: 8, min: 4},
        gameArea: { h: 800, w: 800 },
        size: 16,
        reduceArea: 112,
    };

    get snake(): Snake { return this._snake; }
    get food(): Food[] { return this._food; }
    get score(): number { return this._score; }
    get size(): number { return this._size; }
    get area(): Area { return this._area; }

    newGame() {
        this._food = [];
        const coords = this.randomCoords();
        this._snake = new Snake(coords.x, coords.y, this._area);
        this._snake.on({name: 'move', callback: () => { this.snakeEatFood(); }});
        this._snake.on({name: 'eatMyself', callback: () => { this.gameOver(); } });
        this._snake.on({name: 'snakeWallContact', callback: (e: Sides) => { this.snakeWallContact(e); } });
        this.addFood();
    }

    start() {
        if (this._state !== 'play') {
            this._state = 'play';
            this._timer = setInterval(() => { this._snake.move(); }, this._speed );
        }
    }

    restart() {
        if (this._try > this._settings.maxTry) { return false ; }
        this._try++;
        this.newGame();
        this.start();
    }

    private gameOver() {
        this._state = 'stop';
        clearInterval(this._timer);
    }

    private addFood() {
        const coords = this.randomCoords();
        this._food.push(this._foodService.getFood(coords.x, coords.y));
    }

    private snakeWallContact(side: Sides) {
        if ( this._area.width() - this._reduceArea <= this.snake.length() ||
            this._area.height() - this._reduceArea <= this.snake.length() ) {
            this.gameOver();
        }
        this._snake.reverse();
        this._area.reduce(reverseSide(side), this._reduceArea);
        this.refreshFood();
    }

    private snakeEatFood() {
        const index = this._food.findIndex(item => item.x === this._snake.x() && item.y === this._snake.y());
        if (index > -1) {
            const food = this._food[index];
            this.snake.eat(food);
            this._score += food.score;
            this._food.splice(index, 1);
            setTimeout(() => this.addFood() , this.randomFoodTimeout() );
        }
    }

    private refreshFood() {
        const foodIndex = this._food.findIndex(item => this.area.checkContact(item.x, item.y) != undefined);
        if (foodIndex > - 1) {
            this._food.splice(foodIndex, 1);
            this.addFood();
        }
    }

    private randomCoords() {
        const coords = {
            x: getRandomInt(this._area.x2, this._area.x1),
            y: getRandomInt(this._area.y2, this._area.y1),
        };
        return coords;
    }

    private randomFoodTimeout() {
        return getRandomInt(this._settings.foodTimeout.max, this._settings.foodTimeout.min) * 1000;
    }

    private arrowControls(e: KeyboardEvent) {
        const keys = [
            { codes: [65, 37], dir: Dirs.left },
            { codes: [87, 38], dir: Dirs.up },
            { codes: [68, 39], dir: Dirs.right },
            { codes: [83, 40], dir: Dirs.down },
        ];
        const key = keys.find( k => k.codes.includes(e.keyCode));
        if ( key  && this._state === 'play') {
            this._snake.dir = key.dir;
            this._snake.move(); }
    }
}
