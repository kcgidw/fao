<template>
	<div id="room-setup" class="view">
		<div class="view-container">
			<Confirmation
				id="confirm-leave"
				confirmText="Leave"
				v-show="leaveConfirmationDialogVisible"
				@close="leaveConfirmationDialogVisible = false"
				@confirm="leave"
			>
				<h2>Leave game?</h2>
				<div class="normal-text">
					<p>Are you sure you want to leave this game?</p>
				</div>
			</Confirmation>
			<Confirmation
				id="confirm-start"
				confirmText="Start"
				v-show="startConfirmationDialogVisible"
				@close="startConfirmationDialogVisible = false"
				@confirm="start"
			>
				<h2>Start game?</h2>
				<div class="normal-text">
					<p>Additional players won't be able to join while a game is in progress.</p>
					<p>To add more players later, choose the "Exit to Setup" menu option.</p>
				</div>
			</Confirmation>

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
						<li v-for="username in usernames" :key="'0' + username">{{ username }}</li>
					</ul>
				</div>
			</div>

			<div class="stripe flex-center align-center actions">
				<div class="stripe-content">
					<button class="btn primary big" @click="startConfirmationDialogVisible = true">
						Start Game
					</button>
					<div style="clear: both" />
					<button class="btn tertiary" @click="leaveConfirmationDialogVisible = true">
						Leave
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Store from './state';
import VIEW from './view';
import Confirmation from './confirmation';
export default {
	name: 'SetupView',
	components: {
		Confirmation,
	},
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
			leaveConfirmationDialogVisible: false,
			startConfirmationDialogVisible: false,
		};
	},
	watch: {},
	methods: {
		start() {
			Store.submitStartGame();
		},
		leave() {
			Store.setView(VIEW.HOME);
			Store.submitLeaveGame();
		},
	},
};
</script>
