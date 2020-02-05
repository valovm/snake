import {Food} from './Foods';

export class Orange implements Food {
  constructor(
    private _x: number,
    private _y: number,
  ) {}

  readonly count: number = 2;
  readonly score: number = 9;
  readonly shape: string = 'circle';
  readonly color: string = this.getRandomColor();

  get x(): number { return this._x; }
  get y(): number { return this._y; }

  private getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
