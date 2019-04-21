<template>
	<dialog-component>
        <slot></slot>

		<template #actions>
			<button class="btn tertiary" @click="$emit('close')">Cancel</button>
			<button class="btn primary" @click="$emit('confirm')">Confirm</button>
		</template>

	</dialog-component>
</template>

<script>
const Store = require('./state');
const VIEW = require('./view');
import DialogComponent from './dialog';
export default {
	name: 'Confirmation',
	components: {
		DialogComponent,
	},
	props: {
	},
	data() {
		return {};
	},
	methods: {
	}
};
</script>
