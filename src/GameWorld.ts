import { EventEmitter } from 'events';
import { GameEvent } from './GameEvents';
import { GameObject } from './GameObject';
export class GameWorld {
  readonly events = new EventEmitter();
  private readonly objects: GameObject[] = [];

  getObjects(): GameObject[] {
    return this.objects;
  }

  addObject(object: GameObject) {
    this.subscribeForEvents(object);
    this.objects.push(object);

  }
  clear() {
    const objects = [...this.objects];
    objects.forEach( o => this.removeObject(o) );
  }

  removeObject(object: GameObject) {
    const idx = this.objects.findIndex((it) => it === object);
    if (idx !== -1) {
      this.unsubscribeFromEvents(object);
      this.objects.splice(idx, 1);
    }
  }

  private subscribeForEvents(object: GameObject) {
    object.events.on('event', (event: GameEvent) => {
      this.events.emit('event', event);
    });
  }

  private unsubscribeFromEvents(object: GameObject) {
    object.events.removeAllListeners('event');
  }
}
