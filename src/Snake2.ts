import {Callback, Dirs, reverseDir} from './common';
import {GameObject} from './GameObject';
import {Food} from './foods/Foods';


class SnakeCell implements GameObject  {
  constructor(
    private _x: number,
    private _y: number,
  ) {}

  setXy(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  get x(): number { return this._x; }
  set x(x: number) { this._x = x; }
  get y(): number { return this._y; }
  set y(y: number) { this._y = y; }

  readonly xBegin: number;
  readonly xEnd: number;
  readonly yBegin: number;
  readonly yEnd: number;
  collisionObject?: GameObject;

  onCollision(object: GameObject): void {
    this.collisionObject = object;
  }

}

export class Snake implements GameObject {

  onCollision(object: GameObject): void {}

  update(delta: number): void {
    this.cells.forEach((cell) => {
      if (cell.collisionObject instanceof Food) {
        this.eat(cell.collisionObject);
        this.emit('SnakeEatFood', { food: cell.collisionObject });
      }
      if (cell.collisionObject instanceof SnakeCell) {
        this.emit('SnakeItYourSelf');
      }
    });
    this.move();
  }

  constructor(x: number, y: number) {
    this.cells.push(new SnakeCell(x, y));
    this._head = this.cells[0];
  }
  private _dir: Dirs = Dirs.right;
  private _cells: SnakeCell[] = [];
  private _head: SnakeCell;
  private _callbacks: Callback[] = [];

  x(): number { return this._head.x; }
  y(): number { return this._head.y; }

  length() {
    return this._cells.length;
  }
  get cells(): SnakeCell[] {
    return this._cells;
  }

  set dir(dir: Dirs) {
    if (this.length() > 1 && reverseDir(dir) === this._dir) { return; }
    this._dir = dir;
  }

  move() {
    let x = this._head.x, y = this._head.y;
    switch (this._dir) {
      case Dirs.right: x++; break;
      case Dirs.left: x--; break;
      case Dirs.up: y--; break;
      case Dirs.down: y++; break;
    }
    for (let i = this._cells.length - 1; i > 0; i--) {
        const cell = this._cells[i];
        cell.setXy(this._cells[i - 1].x, this._cells[i - 1].y);
    }
    this._cells[0].setXy(x, y);
  }

  private eat(food: Food) {
    for (let i = 0; i < food.count; i++) {
      const endCell = this.cells[this.cells.length - 1];
      const cell = new SnakeCell(endCell.x, endCell.y);
      this.cells.push(cell);
    }
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
