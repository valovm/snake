import {getRandomInt} from "./heplers";

export abstract class Food {
     x: number;
     y: number;
     count: number;
     color: string;
     shape: string;
     score: number;
}

export class FoodService {
    getFood(x: number, y: number): Food{
        const random = getRandomInt(6);
        if( random > 4){
            return new Orange(x,y);
        }
        return new Apple(x,y);
    }
}

class Apple implements Food {
    constructor(
        private _x: number,
        private _y: number,
    ){}

    readonly count: number = 1;
    readonly score: number = 1;
    readonly color: string = 'red';
    readonly shape: string = 'square';

    get x(): number { return this._x; }
    get y(): number { return this._y; }
}

class Orange implements Food {
    constructor(
        private _x: number,
        private _y: number,
    ){}

    readonly count: number = 2;
    readonly score: number = 9;
    readonly shape: string = 'circle';
    readonly color: string = this.getRandomColor();


    get x(): number { return this._x; }
    get y(): number { return this._y; }



    private getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }



}




