<template>
	<div id="conn-overlay" v-show="!connected">
		<div id="reconnecting-message">Reconnecting...</div>
	</div>
</template>
<script>
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
	},
};
</script>