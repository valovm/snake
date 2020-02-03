import {Callback} from "./callback";

class SnakeCell {
  constructor(
    private _x: number,
    private _y: number,
    private _next?: SnakeCell
  ){}

  setXy(x: number, y: number){
    if( this._next){
      this._next.setXy(this._x, this._y);
    }
    this._x = x;
    this._y = y;
  }

  get x():number { return this._x };
  get y():number { return this._y };

  set next(cell: SnakeCell){
    this._next = cell;
  }
}


export class Snake {
  private _dir: "RIGHT" | "LEFT" | "UP" | "DOWN" = "RIGHT";
  private _cells: SnakeCell[] = [];
  private _head: SnakeCell;

  private _callbacks: Callback[] = [];

  constructor(x: number, y: number) {
    this.cells.push(new SnakeCell(x, y));
    this._head = this.cells[0];
  }

  get cells(): SnakeCell[] {
    return this._cells;
  }

  set dir(dir: "RIGHT" | "LEFT" | "UP" | "DOWN"){
    this._dir = dir;
  }

  move(){
    let x = this._head.x, y = this._head.y;
    switch (this._dir) {
      case "RIGHT": x++; break;
      case "LEFT": x--; break;
      case "UP": y--; break;
      case "DOWN": y++; break;
    }
    this._head.setXy(x, y);
    this.emit('move');
  }

  addCells(count?: number){
    const endCell = this.cells[this.cells.length -1];
    const cell = new SnakeCell(endCell.x, endCell.y);
    endCell.next = cell;
    this.move();
    this.cells.push(cell);
  }

  x(): number { return this._head.x };
  y(): number { return this._head.y };

  on(callback: Callback){
      this._callbacks.push(callback);
  };

  private emit(eventName: string){
      this._callbacks
          .filter(item => item.name === eventName)
          .forEach(item => item.callback());
  }

}
