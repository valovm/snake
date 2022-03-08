import { GameObject } from '../GameObject';

export class Rock extends GameObject {
  constructor(x: number, y: number, width: number, height: number) {
    super();
    this.y = y;
    this.x = x;
    this.height = height;
    this.width = width;
  }
  onCollision(object: GameObject): void {}
  update(delta: number): void {}
}
