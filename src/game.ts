import {Apple} from "./apple";
import {Snake} from "./snake";
import {getRandomInt} from "./heplers";


interface GameSettings {
   maxTry: number;
   foodTimeout: { min: number, max: number},
   gameArea: { w: number, h: number},
   size: number;
}

export class Game {

    private  _snake: Snake;
    private _food: Apple[] = [];

    private _score: number = 0;
    private _try: number = 0;
    private _speed: number = 1000;
    private _size: number = 10;
    private _timer: any;

    constructor(settings?: GameSettings){
        this._settings = { ...settings, ...this._settings };

    }

    start() {

        const coords = this.randomCoords();
        this._snake = new Snake(coords.x, coords.y);

        this._snake.on({name: 'move', callback: () => { this.snakeEatFood() } });

        this.addFood();

        this._timer = setInterval(() => { this._snake.move(); },
            this._speed
        );
    }

    restart(){
        if(this._try > this._settings.maxTry) { return false ;}
        this._food = [];
        this._try++;

        this.start();
    }

    gameOver(){
        clearInterval(this._timer);
    }

    private snakeEatFood(){
        const index = this._food.findIndex(item => item.x == this._snake.x() && item.y == this._snake.y())
        if(index >-1){
            this.food.splice(index, 1);
            this.snake.addCells();
            this._score += 1;
            setTimeout(() => this.addFood() , this.randomFoodTimeout() );
        }
    }


    get snake(): Snake { return this._snake };
    get food(): Apple[] { return this._food };
    get score(): number { return this._score };
    get size(): number { return this._settings.size }

    private _settings: GameSettings = {
        maxTry: 1,
        foodTimeout: {max: 8, min: 4},
        gameArea: { h: 800, w: 800 },
        size: 16,
    };

    private addFood(){
        const coords = this.randomCoords();
        this._food.push(new Apple(coords.x, coords.y));
    }

    private randomCoords(){
        const coords = {
            x: getRandomInt(800 / 16),
            y: getRandomInt(800 /16),
        };

        return coords;
    }

    private randomFoodTimeout(){
        return getRandomInt(this._settings.foodTimeout.max, this._settings.foodTimeout.min) * 1000;
    }
}



