import { EventEmitter } from 'events';

export abstract class GameObject {
    readonly x: number;
    readonly y: number;
    readonly events: EventEmitter = new EventEmitter();

    abstract onCollision(object: GameObject): void;
    abstract update(delta: number): void;
}