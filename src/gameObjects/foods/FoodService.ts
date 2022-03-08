import { getRandomInt } from '../../common';
import {Food} from './Foods';

import {Apple} from './Apple';
import {Orange} from './Orange';

export class FoodService {
  getFood(x: number, y: number): Food {
    const random = getRandomInt(6);
    if ( random > 4) {
      return new Orange(x, y);
    }
    return new Apple(x, y);
  }
}
