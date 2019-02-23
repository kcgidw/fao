<template>
	<div id="conn-overlay" v-show="!connected">
		<div id="reconnecting-message">{{message}}</div>
	</div>
</template>

<script>

const Store = require('./state');
const GameConnection = require(`./game-connection`);

export default {
	name: `ConnectionOverlay`,
	components: {},
	props: {
		gameConnection: {
			type: String,
			required: true,
		},
	},
	computed: {
		connected() {
			return this.gameConnection === GameConnection.CONNECT;
		},
		message() {
			if(Store.state.joinWarning) {
				return 'Reconnection failure: ' + Store.state.joinWarning;
			}
			return 'Reconnecting...';
		}
	},
};
</script>