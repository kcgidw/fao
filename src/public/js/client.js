const ClientGame = require('../../common/cli-game');
const GAME_PHASE = require('../../common/game-phase');
const MESSAGE = require('../../common/message');
const Util = require('../../common/util');
const VIEW = require('./view');
const Store = require('./state');

import Vue from 'vue';

import HomeMenu from './home-menu.vue';
import SetupView from './setup-view.vue';
import GameView from './game-view.vue';

const app = new Vue({
	el: '#wrapper',
	components: {
		HomeMenu,
		SetupView,
		GameView,
	},
	data: {
		state: Store.state,
	},
	computed: {
		roomCode() {
			return this.state.gameState && this.state.gameState.roomCode;
		},
		usernames() {
			return this.state.gameState && this.state.gameState.getUsernames();
		}
	},
});