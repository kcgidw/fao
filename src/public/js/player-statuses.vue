<template>
	<dialog-component id="player-statuses">
		<h2>Players</h2>
		<ul>
			<li v-for="u in users" :key="'0'+u.name">
				<span class="color-spot" :style="{color: color(u)}">
					<svg class="feather">
						<circle cx="12" cy="12" r="4" stroke="black" stroke-width="0" :fill="color(u)" />
					</svg>
				</span>
				<span class="username" :style="{color: color(u)}">{{u.name}}</span>
				<span class="grow-space"></span>
				<span class="connectionStatus" :class="{tinytext: true, connected: u.connected, disconnected: !u.connected}">{{connectionStatusString(u)}}</span>
			</li>
		</ul>
		<div>
			<button class="dialog-close btn secondary" @click="$emit('close')">Close</button>
		</div>
	</dialog-component>
</template>

<script>
const Store = require('./state');
const VIEW = require('./view');
import DialogComponent from './dialog';
export default {
	name: 'PlayerStatuses',
	components: {
		DialogComponent,
	},
	props: {
		users: {
			type: Array,
		},
	},
	data() {
		return {};
	},
	methods: {
		color(user) {
			return Store.state.gameState.getUserColor(user.name);
		},
		connectionStatusString(user) {
			return user.connected ? '' : 'Disconnected';
		},
	}
};
</script>
