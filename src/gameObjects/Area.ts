import { Sides } from '../common';
import { AreaSizeChanged } from '../GameEvents';
import { GameObject } from '../GameObject';
import { Snake } from '../Snake';

export class AreaBorder extends GameObject {
  constructor(x: number, y: number, w: number = 1, h: number = 1, area?: Area, side?: Sides) {
    super();
    this.x = x; this.y = y;
    this.width = w; this.height = h;
    this.area = area;
    this.side = side;
  }
  readonly side: Sides;
  readonly area: Area;

  onCollision(object: GameObject): void {
    if (object instanceof Snake) {
      this.area.descrease(this.side);
      this.events.emit(
        'event',
        new AreaSizeChanged(this.area.x, this.area.y, this.area.width, this.area.height)
      );
    }
  }
  update(delta: number): void {}
}

export class Area {
  constructor(x: number, y: number, w: number = 1, h: number = 1) {

    this.x = x; this.y = y;
    this.width = w; this.height = h;
    this.init();
  }
  x: number;
  y: number;
  width: number;
  height: number;
  readonly borders: any = {};

  descrease(side: Sides): void {
    switch (side) {
      case Sides.top:
        this.borders[Sides.top].y += 1;
        this.borders[Sides.left].height -= 1;
        this.borders[Sides.right].height -= 1;
        this.borders[Sides.left].y += 1;
        this.borders[Sides.right].y += 1;
        this.y++;
        this.height--;
        break;
      case Sides.right:
        this.borders[Sides.right].x -= 1;
        this.borders[Sides.bottom].width -= 1;
        this.borders[Sides.top].width -= 1;
        this.width--;
        break;
      case Sides.bottom:
        this.borders[Sides.bottom].y -= 1;
        this.borders[Sides.left].height -= 1;
        this.borders[Sides.right].height -= 1;
        this.height--;
        break;
      case Sides.left:
        this.borders[Sides.top].width -= 1;
        this.borders[Sides.bottom].width -= 1;
        this.borders[Sides.top].x += 1;
        this.borders[Sides.bottom].x += 1;
        this.borders[Sides.left].x += 1;
        this.width--;
        this.x++;
        break;
    }
  }

  private init() {
    this.borders[Sides.top] = new AreaBorder(this.x, this.y, this.width, 1, this, Sides.top);
    this.borders[Sides.bottom] = new AreaBorder(this.x, this.height - 1 , this.width, 1, this, Sides.bottom);
    this.borders[Sides.right] = new AreaBorder(this.width - 1, this.y , 1, this.height, this, Sides.right);
    this.borders[Sides.left] = new AreaBorder(this.x, this.y , 1, this.height, this, Sides.left);
  }
}
