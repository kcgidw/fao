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
import Store from './state';
import VIEW from './view';
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
	},
};
</script>
