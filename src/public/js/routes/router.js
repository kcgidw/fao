import Vue from 'vue';
import VueRouter from 'vue-router';

import HomeView from './home-view.vue';
import RulesView from './rules-view.vue';
import FaqView from './faq-view.vue';
import SetupView from './setup-view.vue';
import GameView from './game-view.vue';

Vue.use(VueRouter);

const router = new VueRouter({
	base: __dirname,
	routes: [
		{
			path: '/',
			component: HomeView,
		},
		{
			path: '/home',
			redirect: '/',
		},
		{
			path: '/rules',
			component: RulesView,
		},
		{
			path: '/faq',
			component: FaqView,
		},
		{
			path: '/setup',
			component: SetupView,
		},
		{
			path: '/game',
			component: GameView,
		},
	],
});

export default router;
