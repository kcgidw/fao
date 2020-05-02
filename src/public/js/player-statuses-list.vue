<template>
	<ul class="player-statuses-list">
		<li v-for="u in users" :key="'0' + u.name">
			<span v-if="u.connected" :style="{ color: color(u) }"><user-icon /></span>
			<span v-else><wifi-off-icon /></span>
			<span class="username" :style="{ color: color(u) }">{{ u.name }}</span>
		</li>
	</ul>
</template>

<script>
import Store from './state';
import { UserIcon, WifiOffIcon } from 'vue-feather-icons';
export default {
	name: 'PlayerStatusesList',
	components: {
		UserIcon,
		WifiOffIcon,
	},
	props: {
		users: {
			type: Array,
		},
	},
	methods: {
		color(user) {
			return Store.state.gameState.getUserColor(user.name);
		},
	},
};
</script>
