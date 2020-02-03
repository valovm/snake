import {Game} from "./game";

const canvas = document.getElementById('game-snake');
const context = canvas.getContext('2d');

const game = new Game();
game.newGame();


document.addEventListener('keydown', function(e) {
    const keys = [
        { codes: [65, 37], dir: 'LEFT' },
        { codes: [87, 38], dir: 'UP' },
        { codes: [68, 39], dir: 'RIGHT' },
        { codes: [83, 40], dir: 'DOWN' },
    ];
    const key = keys.find( key => key.codes.includes(e.keyCode));
    if( key ) { game.snake.dir = key.dir; game.snake.move() }
});


function render() {
    context.clearRect(0,0, 800, 800);

    context.strokeStyle = "green";
    game.snake.cells.forEach(point => {
        context.strokeRect(point.x * game.size, point.y * game.size, game.size, game.size)
    });

    game.food.forEach(item => {
        context.fillStyle = item.color;
        switch (item.shape) {
            case 'square':
                context.fillRect(item.x * game.size, item.y * game.size, game.size, game.size);
                break;
            case 'circle':
                const r = game.size/2;
                context.beginPath()
                context.arc(item.x * game.size + r, item.y * game.size + r, r, 0, 2 * Math.PI, false);
                context.fillStyle = 'circle';
                context.fill();
            break;
        }
    });

    window.requestAnimationFrame(render);
}


window.requestAnimationFrame(render);





