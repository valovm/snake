import {Game} from '../Game';

export abstract class RenderService {
    private constructor(el: HTMLElement, game: Game) {}
    abstract render(): void;
}
