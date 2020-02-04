import {Game} from "./Game";

const canvas = document.getElementById('game-snake');

const game = new Game(canvas);
game.newGame();
game.start();




