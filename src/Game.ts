import {Food, FoodService} from "./Foods";
import {Snake} from "./Snake";
import {getRandomInt} from "./heplers";
import {CanvasRenderServiceImpl, RenderService} from "./RenderService";

interface GameSettings {
   maxTry: number;
   foodTimeout: { min: number, max: number},
   gameArea: { w: number, h: number},
   size: number;
}

export class Game {
    constructor(el: HTMLCanvasElement, settings?: GameSettings) {
        this._el = el;

        this._settings = {...settings, ...this._settings};
        this.setGameArea(this._settings.gameArea.w, this._settings.gameArea.h );
        this._size = this._settings.size;

        this._foodService = new FoodService();

        this._render = new CanvasRenderServiceImpl(el, this);
        this._render.render();
    }
    private  _el: Element;
    private  _render: RenderService;

    private  _snake: Snake;
    private _food: Food[] = [];
    private _foodService: FoodService;

    private _score: number = 0;
    private _try: number = 0;
    private _speed: number = 200;
    private _size: number = 0;
    private _timer: any;
    private _gameArea: { h: number, w: number } = { h: 0, w: 0 };

    private readonly _settings: GameSettings = {
        maxTry: 1,
        foodTimeout: {max: 8, min: 4},
        gameArea: { h: 800, w: 800 },
        size: 16,
    };

    get snake(): Snake { return this._snake };
    get food(): Food[] { return this._food };
    get score(): number { return this._score };
    get size(): number { return this._size }

    setGameArea(w: number, h: number) {
        this._gameArea.h = h;
        this._gameArea.w = w;
    }
    get gameArea() { return this._gameArea; }

    newGame() {
        const coords = this.randomCoords();
        this._snake = new Snake(coords.x, coords.y);
        this._snake.on({name: 'move', callback: () => {
            this.snakeContactWall();
            this.snakeEatFood();
        }});
        this._snake.on({name: 'eatMyself', callback: () => { this.gameOver() } });
        this.addFood();

    }
    start(){
        window.addEventListener('keydown', (e: KeyboardEvent) => this.arrowControls(e) );
        this._timer = setInterval(() => { this._snake.move(); }, this._speed );
    }

    restart(){
        if(this._try > this._settings.maxTry) { return false ;}
        this._food = [];
        this._try++;
        this.newGame();
        this.start();
    }

    private gameOver(){
        clearInterval(this._timer);
    }

    private addFood(){
        const coords = this.randomCoords();
        this._food.push(this._foodService.getFood(coords.x, coords.y));
    }

    private snakeContactWall(){
        const x = this._snake.x() * this._size,
              y = this._snake.y() * this._size;
        if (x < 0 || x >= this._gameArea.w || y < 0 || y >= this._gameArea.h ){
            this._snake.reverse()
        }
    }

    private snakeEatFood(){
        const index = this._food.findIndex(item => item.x == this._snake.x() && item.y == this._snake.y());
        if(index >-1){
            const food = this._food[index];
            this.snake.eat(food);
            this._score += food.count;
            this._food.splice(index, 1);
            setTimeout(() => this.addFood() , this.randomFoodTimeout() );
        }
    }

    private randomCoords(){
        const coords = {
            x: getRandomInt(this._gameArea.w / this._size),
            y: getRandomInt(this._gameArea.h / this._size),
        };
        return coords;
    }

    private randomFoodTimeout(){
        return getRandomInt(this._settings.foodTimeout.max, this._settings.foodTimeout.min) * 1000;
    }

    arrowControls(e: KeyboardEvent){
        const keys = [
            { codes: [65, 37], dir: 'LEFT' },
            { codes: [87, 38], dir: 'UP' },
            { codes: [68, 39], dir: 'RIGHT' },
            { codes: [83, 40], dir: 'DOWN' },
        ];
        const key = keys.find( key => key.codes.includes(e.keyCode));
        if( key ) {
            // @ts-ignore
            this._snake.dir = key.dir;
            this._snake.move() }
    }


}



