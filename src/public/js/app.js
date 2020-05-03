import Vue from 'vue';
import Store from './state';
import HomeView from './home-view.vue';
import RulesView from './rules-view.vue';
import FaqView from './faq-view.vue';
import SetupView from './setup-view.vue';
import GameView from './game-view.vue';

const app = new Vue({
	el: '#wrapper',
	components: {
		HomeView,
		RulesView,
		FaqView,
		SetupView,
		GameView,
	},
	data: {
		state: Store.state,
	},
	computed: {
		usernames() {
			return this.state.gameState && this.state.gameState.getUsernames();
		},
	},
});
export default app;
