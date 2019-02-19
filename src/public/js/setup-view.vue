<template>
<div id="room-setup" class="view">

	<div class="chunk game-code">
		<div id="setup-header">Your game code is:</div>
		<h1>{{ roomCode }}</h1>
	</div>

	<div class="chunk users">
		<div id="setup-header">Players:</div>
		<ul class="users">
			<li v-for="username in usernames" :key="'0' + username">{{username}}</li>
		</ul>
	</div>

	<div class="chunk actions">
		<div class="tip" style="margin-bottom: 10px;">
			New players can't join once a game is in progress.
		</div>
		<button class="btn primary big" @click="start">Start Game</button>
		<div style="clear: both"/>
		<button class="btn tertiary" @click="leave">Leave</button>
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
