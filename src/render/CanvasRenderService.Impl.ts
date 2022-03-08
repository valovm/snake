import { GameObject } from '../GameObject';
import { Food } from '../gameObjects/foods/Foods';
import { Rock } from '../gameObjects/Rock';
import {RenderService} from './RenderService';
import {Game} from '../Game';

class Coords {
  constructor(readonly x: number, readonly y: number) {}
}

export class CanvasRenderServiceImpl implements RenderService {

  private readonly cellSize = 16;
  private readonly border = 1;
  private readonly game: Game;
  private readonly objects: GameObject[];
  private context: CanvasRenderingContext2D;

  private readonly elRoot: HTMLElement;
  private elCanvas: HTMLCanvasElement;

  constructor(el: HTMLElement, game: Game) {
    this.elRoot = el;
    this.game = game;
    this.objects = game.objects;
    this.init();
  }

    render() {
      this.CanvasRender();
    }

    private init() {
      this.elCanvas = document.createElement('canvas') as HTMLCanvasElement;
      this.context = this.elCanvas.getContext('2d');
      this.elCanvas.width = (this.game.size.cols * this.cellSize) + (this.border * 2);
      this.elCanvas.height = (this.game.size.rows * this.cellSize) + (this.border * 2);
      this.elRoot.appendChild(this.elCanvas);
    }

    private CanvasRender() {
      this.context.clearRect(0, 0, this.elCanvas.clientWidth + (this.border * 2),  this.elCanvas.clientHeight + (this.border * 2) );

      this.snakeRender();
      this.objects.forEach(o => {
        if (o instanceof Food) { this.foodRender(o); return; }
        if (o instanceof Rock) { this.rockRender(o); return; }
      });

      window.requestAnimationFrame(() => this.CanvasRender());
    }

    private snakeRender() {
        if (!this.game.snake) { return; }
        this.context.strokeStyle = 'white';
        this.context.fillStyle = 'white';
        this.game.snake.cells.forEach(item => {
            const coords = this.getCoords(item.x, item.y);
            this.context.lineWidth = 1;
            this.context.strokeRect(coords.x , coords.y, this.cellSize , this.cellSize);
            this.context.fillRect(coords.x + 2 , coords.y + 2, this.cellSize - 4, this.cellSize  - 4 );
        });
    }

    private foodRender(item: Food) {
      this.context.fillStyle = item.color;
      const coords = this.getCoords(item.x, item.y);

      switch (item.shape) {
          case 'square':
              this.context.fillRect(coords.x , coords.y, this.cellSize, this.cellSize);
              break;
          case 'circle':
              const r = this.cellSize / 2;
              this.context.beginPath();
              this.context.arc(coords.x + r, coords.y + r, r, 0, 2 * Math.PI, false);
              this.context.fillStyle = 'circle';
              this.context.fill();
              break;
      }

    }

  private rockRender(item: Rock) {
    const coords = this.getCoords(item.x, item.y);
    this.context.strokeStyle = '#6519fb';
    this.context.fillStyle = '#333';
    this.context.fillRect(coords.x , coords.y, this.cellSize * item.width, this.cellSize * item.height);
  }

  private getCoords(x: number, y: number): Coords {
    return new Coords(
      x * this.cellSize + this.border,
      y * this.cellSize + this.border,
    );
  }
}
