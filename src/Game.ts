import {Food, FoodService} from "./Foods";
import {Snake} from "./Snake";
import {Dirs, getRandomInt, reverseSide, Sides} from "./heplers";
import {Area} from "./Area";
import {CanvasRenderServiceImpl} from "./render/CanvasRenderService.Impl";
import {RenderService} from "./render/RenderService";

interface GameSettings {
   maxTry: number;
   foodTimeout: { min: number, max: number},
   gameArea: { w: number, h: number},
   size: number;
}


export class Game {
    constructor(el: HTMLCanvasElement, settings?: GameSettings) {
        this._settings = {...settings, ...this._settings};
        this._size = this._settings.size;

        this._q = 112 / this._size;

        this._foodService = new FoodService();

        this._area = new Area(0, this._settings.gameArea.w / this._size ,
                              0, this._settings.gameArea.h / this._size);

        this._render = new CanvasRenderServiceImpl(el, this);
        this._render.render();

        window.addEventListener('keydown', (e: KeyboardEvent) => this.arrowControls(e) );
    }

    private  _render: RenderService;

    private  _area: Area;
    private  _snake: Snake;
    private _food: Food[] = [];
    private _foodService: FoodService;

    private _state: 'stop' | 'play' = 'stop';
    private _score: number = 0;
    private _try: number = 0;
    private _speed: number = 200;
    private _size: number = 0;
    private _timer: any;


    private _q = 0;

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

    get area():Area { return this._area; }

    newGame() {
        this._food = [];
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
        if (this._state != 'play'){
            this._state = 'play';
            this._timer = setInterval(() => { this._snake.move(); }, this._speed );
        }
    }
    restart(){
        if(this._try > this._settings.maxTry) { return false ;}
        this._try++;
        this.newGame();
        this.start();
    }

    private gameOver(){
        this._state = 'stop';
        clearInterval(this._timer);
    }

    private addFood(){
        const coords = this.randomCoords();
        this._food.push(this._foodService.getFood(coords.x, coords.y));
    }

    private snakeContactWall(){
        const contact = this.checkSnakeContactWall();

        if (contact != undefined){
            this._snake.reverse();
            this._area.reduce(reverseSide(contact), this._q);
        }
    }

    private checkSnakeContactWall(): Sides|undefined{
        const x = this._snake.x(),
              y = this._snake.y();
        if(x < this.area.x1) { return Sides.right }
        if(x + 1 > this.area.x2) { return Sides.left }
        if(y < this.area.y1) { return Sides.top }
        if(y + 1 > this.area.y2) { return Sides.bottom }


        return undefined;
    }

    private snakeEatFood(){
        const index = this._food.findIndex(item => item.x == this._snake.x() && item.y == this._snake.y());
        if(index >-1){
            const food = this._food[index];
            this.snake.eat(food);
            this._score += food.score;
            this._food.splice(index, 1);
            setTimeout(() => this.addFood() , this.randomFoodTimeout() );
        }
    }

    private randomCoords(){
        const coords = {
            x: getRandomInt(this._area.x2, this._area.x1),
            y: getRandomInt(this._area.y2, this._area.y1),
        };
        return coords;
    }

    private randomFoodTimeout(){
        return getRandomInt(this._settings.foodTimeout.max, this._settings.foodTimeout.min) * 1000;
    }

    private arrowControls(e: KeyboardEvent){
        const keys = [
            { codes: [65, 37], dir: Dirs.left },
            { codes: [87, 38], dir: Dirs.up },
            { codes: [68, 39], dir: Dirs.right },
            { codes: [83, 40], dir: Dirs.down },
        ];
        const key = keys.find( key => key.codes.includes(e.keyCode));
        if( key  && this._state == 'play') {
            this._snake.dir = key.dir;
            this._snake.move() }
    }


}



