
import {Game} from "./Game";
import Vue from 'vue/dist/vue.min.js';

var app = new Vue({
    el: '#app',
    data: {
        game: new Game(),
    },
    methods:{
        restart(){
            this.game.restart();
        },
        scoreWin() {
            return this.game.prevScore != undefined && this.game.score > this.game.prevScore;
        }
    },
    computed:{
        modal(){
            return this.game.state === 'over';
        }
    },
    mounted() {
        this.game.render(this.$refs['game-snake']);
        this.game.newGame();
        this.game.start();
    }

});
