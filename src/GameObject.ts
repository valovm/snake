import { EventEmitter } from 'events';

export abstract class GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    readonly events: EventEmitter = new EventEmitter();

    abstract onCollision(object: GameObject): void;
    abstract update(delta: number): void;
}
