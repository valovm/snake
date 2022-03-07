import { Food } from './foods/Foods';
import {GameObject} from './GameObject';

export interface GameEvent {
  readonly data?: unknown;
}

export class AddedGameObjects implements GameEvent {
  readonly data: { objects: GameObject[] };

  constructor(objects: GameObject[] ) {
    this.data = { objects };
  }
}

export class SnakeAteFood implements GameEvent {
  readonly data: { snake: GameObject; food: Food };

  constructor(snake: GameObject, food: Food ) {
    this.data = { snake, food };
  }
}

export class SnakeDied implements GameEvent {
  readonly data: { snake: GameObject };

  constructor(snake: GameObject) {
    this.data = { snake };
  }
}
