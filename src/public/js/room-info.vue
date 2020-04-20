<template>
	<dialog-component id="room-info">
		<div id="room-info-code">
			<h2>Game code: {{ roomCode }}</h2>
		</div>
		<div id="player-statuses">
			<h2>Players:</h2>
			<ul>
				<li v-for="u in users" :key="'0' + u.name">
					<svg class="feather color-spot" :style="{ color: color(u) }">
						<circle
							cx="12"
							cy="12"
							r="4"
							stroke="black"
							stroke-width="0"
							:fill="color(u)"
						/>
					</svg>
					<span class="username" :style="{ color: color(u) }">{{ u.name }}</span>
					<span class="grow-space"></span>
					<span
						class="connectionStatus"
						:class="{
							tinytext: true,
							connected: u.connected,
							disconnected: !u.connected,
						}"
						>{{ connectionStatusString(u) }}</span
					>
				</li>
			</ul>
		</div>

		<template #actions>
			<div>
				<button class="btn secondary" @click="$emit('close')">Close</button>
			</div>
		</template>
	</dialog-component>
</template>

<script>
import Store from './state';
import VIEW from './view';
import DialogComponent from './dialog';
export default {
	name: 'RoomInfo',
	components: {
		DialogComponent,
	},
	props: {
		roomCode: {
			type: String,
		},
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
	},
};
</script>
