<template>
	<div id="game-menu" class="dropup">
		<button
			id="game-menu-btn"
			class="flex-center"
			:class="{ expanded: expanded === true }"
			@click="toggle"
		>
			<more-vertical-icon />
		</button>
		<div id="game-menu-dropdown" class="dropup-content" v-show="expanded === true">
			<ul class="dropup-list">
				<div v-for="item in items" :key="item.text">
					<li v-if="!item.hr" @click="doAction(item)">{{ item.text }}</li>
					<hr v-if="item.hr" />
				</div>
			</ul>
		</div>
	</div>
</template>
<script>
import Store from './state';
import { MoreVerticalIcon } from 'vue-feather-icons';
export default {
	name: 'GameMenu',
	components: {
		MoreVerticalIcon,
	},
	props: {
		items: Array,
		/* item in items: {
			text: String. Text to display. Also the item key
			hr: Boolean. If true, this item is just a <hr>
			action: Function. Executes on click
		} */
	},
	data() {
		return {
			expanded: false,
		};
	},
	methods: {
		toggle(event) {
			this.expanded = !this.expanded;
		},
		toggleHide() {
			this.expanded = false;
		},
		doAction(item) {
			if (item.action) {
				item.action();
				this.toggleHide();
			}
		},
		senseClickOutside(event) {
			let clickedOutside;
			if (event.composedPath) {
				clickedOutside =
					event.composedPath().indexOf(document.getElementById('game-menu')) === -1;
			} else {
				// Edge, IE
				clickedOutside =
					Array.from(
						document.getElementById('game-menu').getElementsByTagName('*')
					).indexOf(event.target) === -1;
			}
			if (clickedOutside) {
				this.toggleHide();
			}
		},
	},
	mounted() {
		document.addEventListener('pointerdown', this.senseClickOutside);
	},
	beforeDestroy() {
		document.removeEventListener('pointerdown', this.senseClickOutside);
	},
};
</script>
