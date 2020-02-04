import {Game} from "./Game";


export abstract class RenderService {
    private constructor(el: HTMLCanvasElement, game: Game){}
    abstract render(): void;
}

export class CanvasRenderServiceImpl implements RenderService{
    constructor(el: HTMLCanvasElement, game: Game){
        this.el = el;
        this.game = game;
        this.context = el.getContext('2d');

        el.width = this.game.gameArea.w;
        el.height = this.game.gameArea.h;
    }
    private readonly el: Element;
    private readonly game: Game;
    private context: CanvasRenderingContext2D;

    render() {
        this.context.clearRect(0,0, this.game.gameArea.w, this.game.gameArea.h);
        this.snakeRender();
        this.foodRender();

        window.requestAnimationFrame(() => this.render());
    }

    private snakeRender(){
        if(!this.game.snake) { return }
        this.context.strokeStyle = "green";
        this.game.snake.cells.forEach(point => {
            this.context.strokeRect(point.x * this.game.size, point.y * this.game.size, this.game.size, this.game.size)
        });
    }

    private foodRender(){
        this.game.food.forEach(item => {
            this.context.fillStyle = item.color;
            switch (item.shape) {
                case 'square':
                    this.context.fillRect(item.x * this.game.size, item.y * this.game.size, this.game.size, this.game.size);
                    break;
                case 'circle':
                    const r = this.game.size/2;
                    this.context.beginPath();
                    this.context.arc(item.x * this.game.size + r, item.y * this.game.size + r, r, 0, 2 * Math.PI, false);
                    this.context.fillStyle = 'circle';
                    this.context.fill();
                    break;
            }
        });
    }
}
