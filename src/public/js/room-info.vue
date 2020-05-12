<template>
	<dialog-component id="room-info">
		<div id="room-info-code">
			<h2>Code: {{ roomCode }}</h2>
		</div>
		<div id="player-statuses">
			<PlayerStatusesList :users="users" />
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
import PlayerStatusesList from './player-statuses-list';
export default {
	name: 'RoomInfo',
	components: {
		DialogComponent,
		PlayerStatusesList,
	},
	props: {
		roomCode: {
			type: String,
		},
		users: {
			type: Array,
		},
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
