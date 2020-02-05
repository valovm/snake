import {Food} from './Foods';

export class Apple implements Food {
  constructor(
    private _x: number,
    private _y: number,
  ) {}

  readonly count: number = 1;
  readonly score: number = 1;
  readonly color: string = 'red';
  readonly shape: string = 'square';

  get x(): number { return this._x; }
  get y(): number { return this._y; }
}
