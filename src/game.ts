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

    constructor(settings?: GameSettings) {
        this._settings = {...settings, ...this._settings};
        this.setGameArea(this._settings.gameArea.w, this._settings.gameArea.h );
        this._size = this._settings.size;
    }

    private  _snake: Snake;
    private _food: Apple[] = [];

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
    get food(): Apple[] { return this._food };
    get score(): number { return this._score };
    get size(): number { return this._size }

    setGameArea(w: number, h: number) {
        this._gameArea.h = h;
        this._gameArea.w = w;
    }

    newGame() {
        const coords = this.randomCoords();
        this._snake = new Snake(coords.x, coords.y);
        this._snake.on({name: 'move', callback: () => {
            this.wallContact();
            this.snakeEatFood();
        }});
        this._snake.on({name: 'eatMyself', callback: () => { this.gameOver() } });
        this.addFood();

        this._timer = setInterval(() => { this._snake.move(); }, this._speed );
    }

    restart(){
        if(this._try > this._settings.maxTry) { return false ;}
        this._food = [];
        this._try++;
        this.newGame();
    }

    private gameOver(){
        clearInterval(this._timer);
    }

    private wallContact(){
        const x = this._snake.x() * this._size,
              y = this._snake.y() * this._size;
        if (x < 0 || x >= this._gameArea.w || y < 0 || y >= this._gameArea.h ){
            this._snake.reverse()
        }
    }

    private snakeEatFood(){
        const index = this._food.findIndex(item => item.x == this._snake.x() && item.y == this._snake.y());
        if(index >-1){
            this.food.splice(index, 1);
            this.snake.addCells();
            this._score += 1;
            setTimeout(() => this.addFood() , this.randomFoodTimeout() );
        }
    }


    private addFood(){
        const coords = this.randomCoords();
        this._food.push(new Apple(coords.x, coords.y));
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
}



