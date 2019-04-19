<template>
	<div id="conn-overlay" class="flex-center" v-show="!connected">
		<div id="reconnecting-message">{{message}}</div>
	</div>
</template>

<script>
const Store = require('./state');
const CONNECTION_STATE = require(`./connection-state`);

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
			return this.gameConnection === CONNECTION_STATE.CONNECT;
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