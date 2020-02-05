import {Sides} from './common';

export class Area {
    constructor(
      private _x1: number,
      private _x2: number,
      private _y1: number,
      private _y2: number,
    ) {}

    width(): number { return this._x2 - this._x1; }
    height(): number { return this._y2 - this._y1; }

    get x1(): number { return this._x1; }
    get x2(): number { return this._x2; }
    get y1(): number { return this._y1; }
    get y2(): number { return this._y2; }

    reduce(side: Sides, units: number) {
      switch (side) {
        case Sides.bottom: this._y2 -= units; break;
        case Sides.top: this._y1 += units; break;
        case Sides.right: this._x1 += units; break;
        case Sides.left: this._x2 -= units; break;
      }
    }

    checkContact(x: number, y: number): Sides|undefined {
      if (x < this.x1) { return Sides.right; }
      if (x + 1 > this.x2) { return Sides.left; }
      if (y < this.y1) { return Sides.top; }
      if (y + 1 > this.y2) { return Sides.bottom; }

      return undefined;
    }

}
