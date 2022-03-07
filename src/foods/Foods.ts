import { EventEmitter } from 'events';
import {GameObject} from '../GameObject';

export abstract class Food extends GameObject {

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }
  x: number;
  y: number;
  count: number;
  color: string;
  shape: string;
  score: number;

  onCollision(object: GameObject) {}
  update(delta: number) {}
}
