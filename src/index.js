import {Game} from "./Game";

const gameDiv = document.getElementById('game-snake');

const game = new Game(gameDiv);
game.newGame();
game.start();
