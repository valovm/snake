
import {Game} from "./Game";
import Vue from 'vue/dist/vue.min.js';
import {CanvasRenderServiceImpl} from "./render/CanvasRenderService.Impl";

var app = new Vue({
    el: '#app',
    data: {
        game: new Game(),
        gameRender: undefined,
    },
    methods:{
        restart(){
            this.game.restart();
        },
        scoreWin() {
            return this.game.prevScore != undefined && this.game.score > this.game.prevScore;
        },
        keyDown(event){
            this.game.handlerKey(event.keyCode);
        }
    },
    computed:{
        modal(){
            return this.game.state === 'over';
        }
    },
    mounted() {
        window.addEventListener('keydown', (e) => this.keyDown(e) );
        this.gameRender = new CanvasRenderServiceImpl(this.$refs['game-snake'], this.game)
        this.gameRender.render();
        this.game.newGame();
        this.game.start();
    }
});
