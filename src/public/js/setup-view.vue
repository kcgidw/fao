<template>
<div id="room-setup" class="view">

	<div class="chunk game-code">
		<div>Your game code is:</div>
		<h1>{{ roomCode }}</h1>
	</div>

	<div class="chunk users">
		<h3>Users:</h3>
		<ul class="users username">
			<li v-for="username in usernames" :key="'0' + username">{{username}}</li>
		</ul>
	</div>

	<div class="chunk actions">
		<button class="btn primary big start" @click="start">Start Game</button>
		<div style="clear: both"/>
		<button class="btn secondary leave" @click="leave">Leave</button>
	</div>

</div>
</template>

<script>
const Store = require('./state');
const VIEW = require('./view');
export default {
	name: 'SetupView',
	props: {
		roomCode: {
			type: String,
		},
		usernames: {
			type: Array,
		},
	},
	data() {
		return {
		};
	},
	watch: {
	},
	methods: {
		start() {
			Store.submitStartGame();
		},
		leave() {
			Store.setView(VIEW.HOME);
			Store.submitLeaveGame();
		},
	}
};
</script>
