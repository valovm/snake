import {Callback, Dirs, reverseDir} from './common';
import {Area} from './Area';
import {Food} from './foods/Foods';

class SnakeCell {
  constructor(
    private _x: number,
    private _y: number,
  ) {}

  setXy(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  get x(): number { return this._x; }
  get y(): number { return this._y; }
  set x(x: number) { this._x = x; }
  set y(y: number) { this._y = y; }

}

export class Snake {
  constructor(x: number, y: number, area: Area) {
    this.cells.push(new SnakeCell(x, y));
    this._head = this.cells[0];
    this._area = area;
  }
  private _dir: Dirs = Dirs.right;
  private _cells: SnakeCell[] = [];
  private _head: SnakeCell;
  private _area: Area;
  private _callbacks: Callback[] = [];

  x(): number { return this._head.x; }
  y(): number { return this._head.y; }

  length() {
    return this._cells.length;
  }
  get cells(): SnakeCell[] {
    return this._cells;
  }

  set dir(dir: Dirs) { this._dir = dir; }

  move() {
    let x = this._head.x, y = this._head.y;
    switch (this._dir) {
      case Dirs.right: x++; break;
      case Dirs.left: x--; break;
      case Dirs.up: y--; break;
      case Dirs.down: y++; break;
    }

    const contact = this._area.checkContact(x, y);
    if (contact !== undefined) {
        this.emit('snakeWallContact', contact);
    } else {
        for (let i = this._cells.length - 1; i > 0; i--) {
            const cell = this._cells[i];
            cell.setXy(this._cells[i - 1].x, this._cells[i - 1].y);
        }
        this._cells[0].setXy(x, y);
    }

    this.emit('move');
    if ( this.checkItMySelf() ) { this.emit('eatMyself'); }
  }

  eat(food: Food) {
     for (let i = 0; i < food.count; i++) {
         const endCell = this.cells[this.cells.length - 1];
         const cell = new SnakeCell(endCell.x, endCell.y);
         this.move();
         this.cells.push(cell);
     }
  }

  reverse() {
      this._cells.reverse();
      this._head = this._cells[0];
      this._dir = reverseDir(this._dir);
  }

  reverse2() {
    switch (this._dir) {
        case Dirs.down: return this._head.y = this._area.y1; break;
        case Dirs.up: return this._head.y = this._area.y2; break;
        case Dirs.left: return this._head.x = this._area.x2; break;
        case Dirs.right: return this._head.x = this._area.x1; break;
    }
  }

  private checkItMySelf() {
      const head = this._head;
      const cell = this._cells.find(item => item !== head && item.x === head.x && item.y === head.y );
      if (cell) { return true; }
      return false;
  }

  on(callback: Callback) {
      this._callbacks.push(callback);
  }

  private emit(eventName: string, context?: any) {
      this._callbacks
          .filter(item => item.name === eventName)
          .forEach(item => item.callback(context));
  }

}
