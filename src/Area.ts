import {Sides} from "./heplers";

export class Area {
    constructor(
        private _x1: number,
        private _x2: number,
        private _y1: number,
        private _y2: number,
    ){}


    width(): number{ return this._x2 - this._x1; }
    height(): number{ return this._x2 - this._x1; }

    get x1():number { return this._x1 };
    get x2():number { return this._x2 };
    get y1():number { return this._y1 };
    get y2():number { return this._y2 };


    reduce(side: Sides, units: number){

    }


}
