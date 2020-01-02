import Store from './state';

import Vue from 'vue';
import '../style/style.scss';

import HomeMenu from './home-menu.vue';
import SetupView from './setup-view.vue';
import GameView from './game-view.vue';
import RulesView from './rules-view.vue';
import GameMenu from './game-menu.vue';

const app = new Vue({
	el: '#wrapper',
	components: {
		HomeMenu,
		SetupView,
		GameView,
		GameMenu,
		RulesView,
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
		},
	},
});