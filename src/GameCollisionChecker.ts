import { GameObject } from './GameObject';

export class GameCollisionChecker {
  checkCollisions(object: GameObject, objects: GameObject[]) {
    objects.forEach(item => {
        if (this.isCollision(object, item)) {
          object.onCollision(item);
          item.onCollision(object);
        }
    });
  }
  haveCollisions(object: GameObject, objects: GameObject[]) {
    for (const item of objects) {
      if (this.isCollision(object, item)) { return true; }
    }
    return false;
  }
  isCollision(o: GameObject, o2: GameObject) {
    if (o === o2) { return false; }
    if (o.x >= o2.x && o.x < o2.x + o2.width &&
      o.y >= o2.y && o.y < o2.y + o2.height) {return true; } else { return  false; }
  }
}
