import {Game} from "../Game";


export abstract class RenderService {
    private constructor(el: HTMLCanvasElement, game: Game){}
    abstract render(): void;
}

