<template>
	<dialog-component>
		<slot></slot>

		<template #actions>
			<button class="btn tertiary" @click="$emit('close')">{{ cancelText }}</button>
			<button class="btn primary" @click="$emit('confirm')">{{ confirmText }}</button>
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
		cancelText: {
			type: String,
			default: 'Cancel',
		},
		confirmText: {
			type: String,
			default: 'Confirm',
		},
	},
};
</script>
