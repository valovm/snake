import {getRandomInt} from "./heplers";

export abstract class Food {
     x: number;
     y: number;
     count: number;
     color: string;
     shape: string;
}

export class FoodService {
    getFood(x: number, y: number): Food{
        const random = getRandomInt(2);
        console.log(x, y);
        return new Orange(x,y);
    }
}

class Apple implements Food {
    constructor(
        private _x: number,
        private _y: number,
    ){}

    readonly count: number = 1;
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
    readonly color: string = 'orange';
    readonly shape: string = 'circle';

    get x(): number { return this._x; }
    get y(): number { return this._y; }
}
