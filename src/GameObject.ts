export interface GameObject {
    readonly xBegin: number;
    readonly yBegin: number;
    readonly xEnd: number;
    readonly yEnd: number;
    onCollision(object: GameObject): void;
    update(delta: number): void;
}