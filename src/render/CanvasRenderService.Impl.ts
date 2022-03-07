import { Food } from '../foods/Foods';
import { GameObject } from '../GameObject';
import {RenderService} from './RenderService';
import {Game} from '../Game';

export class CanvasRenderServiceImpl implements RenderService {
    constructor(el: HTMLElement, game: Game) {
        this.elRoot = el;
        this.game = game;
        this.objects = game.objects;
        this.init();
    }
    private readonly border = 1;
    private readonly game: Game;
    private readonly objects: GameObject[];
    private context: CanvasRenderingContext2D;

  private readonly elRoot: HTMLElement;
  private elCanvas: HTMLCanvasElement;

    render() {
      this.CanvasRender();
    }

    private init() {
      this.elCanvas = document.createElement('canvas') as HTMLCanvasElement;
      this.context = this.elCanvas.getContext('2d');
      this.elCanvas.width = 800; // this.game.area.width() * this.game.size + (this.border * 2);
      this.elCanvas.height = 800; // this.game.area.height() * this.game.size + (this.border * 2);
      this.elRoot.appendChild(this.elCanvas);
    }

    private CanvasRender() {
      this.context.clearRect(0, 0, this.elCanvas.clientWidth + (this.border * 2),  this.elCanvas.clientHeight + (this.border * 2) );

      // this.wallsRender();
      this.snakeRender();

      this.objects.forEach(o => {
        if (o instanceof Food) {
          this.foodRender(o);
          return;
        }
      });

      window.requestAnimationFrame(() => this.CanvasRender());
    }
    /*

    private wallsRender() {
        this.context.strokeStyle = '#6519fb';
        this.context.lineWidth = this.border;
        this.context.strokeRect(
          this.getCoord(this.game.area.x1),
          this.getCoord(this.game.area.y1),
            this.game.area.width()  * this.game.size,
            this.game.area.height()  * this.game.size );
    }
*/
    private snakeRender() {
        if (!this.game.snake) { return; }
        this.context.strokeStyle = 'white';
        this.context.fillStyle = 'white';
        this.game.snake.cells.forEach(item => {
            const x = this.getCoord(item.x),
                  y = this.getCoord(item.y);
            this.context.lineWidth = 1;
            this.context.strokeRect(x , y, this.game.size, this.game.size);
            this.context.fillRect(x + 2 , y + 2, this.game.size - 4, this.game.size - 4 );
        });
    }

    private foodRender(item: Food) {
      this.context.fillStyle = item.color;
      const x = this.getCoord(item.x),
            y = this.getCoord(item.y);

      switch (item.shape) {
          case 'square':
              this.context.fillRect(x , y, this.game.size, this.game.size);
              break;
          case 'circle':
              const r = this.game.size / 2;
              this.context.beginPath();
              this.context.arc(x + r, y + r, r, 0, 2 * Math.PI, false);
              this.context.fillStyle = 'circle';
              this.context.fill();
              break;
      }

    }

    private getCoord(x: number): number {
      return x * this.game.size + this.border;
    }
}
