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
        console.log(this.game.area.width());

        el.width = this.game.area.width() * this.game.size;
        el.height = this.game.area.height() * this.game.size;
    }
    private readonly el: Element;
    private readonly game: Game;
    private context: CanvasRenderingContext2D;

    render() {
        this.context.clearRect(0,0, this.el.clientWidth,  this.el.clientHeight );

        this.wallsRender();
        this.snakeRender();
        this.foodRender();

        window.requestAnimationFrame(() => this.render());
    }

    private wallsRender(){
        this.context.strokeStyle = "blue";
        this.context.strokeRect(
            this.game.area.x1,
            this.game.area.y1,
            this.game.area.width()  * this.game.size,
            this.game.area.height()  * this.game.size );
    }

    private snakeRender(){
        if(!this.game.snake) { return }
        this.context.strokeStyle = "green";
        this.game.snake.cells.forEach(item => {
            const x =  item.x * this.game.size,
                  y =  item.y * this.game.size;
            this.context.strokeRect(x , y, this.game.size, this.game.size)
        });
    }

    private foodRender(){
        this.game.food.forEach(item => {
            this.context.fillStyle = item.color;
            const x =  item.x * this.game.size,
                  y =  item.y * this.game.size;
            switch (item.shape) {
                case 'square':
                    this.context.fillRect(x , y, this.game.size, this.game.size);
                    break;
                case 'circle':
                    const r = this.game.size/2;
                    this.context.beginPath();
                    this.context.arc(x + r, y + r, r, 0, 2 * Math.PI, false);
                    this.context.fillStyle = 'circle';
                    this.context.fill();
                    break;
            }
        });
    }
}
