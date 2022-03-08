
import {Game} from "./Game";
import Vue from 'vue/dist/vue.min.js';
import {CanvasRenderServiceImpl} from "./render/CanvasRenderService.Impl";

var app = new Vue({
    el: '#app',
    data: {
        game: new Game(),
        gameRender: undefined,
        bestScore: 0,
        modalGameOverShow: false
    },
    methods:{
        restart(){
            this.game.restart();
            this.modalGameOverShow = false;
        },
        keyDown(event){
            this.game.handlerKey(event.keyCode);
        },
        getBestScore() {
            const prevScore = this.game.scores.find(s => this.game.score < s);
            this.bestScore =  prevScore ? prevScore : this.game.score;
        },
    },
    watch: {
       'game.state': function (val){
           if  (val == 'over'){
               this.getBestScore();
               this.modalGameOverShow = true;
           }
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
