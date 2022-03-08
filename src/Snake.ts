import { Dirs, reverseDir } from './common';
import {GameObject} from './GameObject';

import { AddedGameObjects, SnakeAteFood, SnakeDied } from './GameEvents';
import { AreaBorder } from './gameObjects/Area';
import { Food } from './gameObjects/foods/Foods';
import { Rock } from './gameObjects/Rock';

class SnakeCell extends GameObject {
  constructor(
    private _x: number,
    private _y: number,
  ) {
    super();
    this.height = 1;
    this.width = 1;
  }

  setXy(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  get x(): number { return this._x; }
  get y(): number { return this._y; }

  onCollision(object: GameObject): void {}
  update(delta: number): void {}
}

export class Snake extends GameObject {

  private _dir: Dirs = Dirs.right;
  private _cells: SnakeCell[] = [];

  constructor(x: number, y: number) {
    super();
    this.cells.push(new SnakeCell(x, y));
  }

  get x(): number { return this.cells[0].x; }
  get y(): number { return this.cells[0].y; }

  get cells(): SnakeCell[] {
    return this._cells;
  }
  set dir(dir: Dirs) {
    if (this.length() > 1 && reverseDir(dir) === this._dir) { return; }
    this._dir = dir;
  }

  onCollision(object: GameObject) {
    if (object instanceof Food) {
      const cells = this.eat(object);
      this.events.emit('event', new SnakeAteFood(this, object));
      this.events.emit('event', new AddedGameObjects(cells));
      return;
    }
    if (object instanceof SnakeCell) {
      this.events.emit('event', new SnakeDied(this));
      return;
    }
    if (object instanceof Rock) {
      this.events.emit('event', new SnakeDied(this));
      return;
    }
    if (object instanceof AreaBorder) {
      this.reverse();
      return;
    }
  }

  update(delta: number): void {
    this.move();
  }

  length() {
    return this._cells.length;
  }

  move() {
    let x = this.x;
    let y = this.y;
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
    const cells = [];
    for (let i = 0; i < food.count; i++) {
      const endCell = this.cells[this.cells.length - 1];
      const cell = new SnakeCell(endCell.x, endCell.y);
      this.cells.push(cell);
      cells.push(cell);
    }
    return cells;
  }

  reverse() {
    this._cells.reverse();
    this._dir = reverseDir(this._dir);
    this.move();
    this.move();
  }
}
