<template>
	<div class="dialog-component">
		<div class="dialog-overlay flex-center">
			<div class="stripe">
				<div class="stripe-content">
					<div class="dialog-window">
						<slot></slot>
						<div class="dialog-actions">
							<slot name="actions"></slot>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'DialogComponent',
};
</script>
