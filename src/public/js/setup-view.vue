<template>
<div id="room-setup" class="view">

	<div class="stripe flex-center align-center game-code">
		<div class="stripe-content">
			<div id="setup-header">Your game code is:</div>
			<h1>{{ roomCode }}</h1>
		</div>
	</div>

	<div class="stripe flex-center align-center users">
		<div class="stripe-content">
			<div id="setup-header">Players:</div>
			<ul class="users">
				<li v-for="username in usernames" :key="'0' + username">{{username}}</li>
			</ul>
		</div>
	</div>

	<div class="stripe flex-center align-center actions">
		<div class="stripe-content">
			<div class="tip" style="margin-bottom: 10px;">
				Additional players won't be able to join while a game is in progress.
			</div>
			<button class="btn primary big" @click="start">Start Game</button>
			<div style="clear: both"/>
			<button class="btn tertiary" @click="leave">Leave</button>
		</div>
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
