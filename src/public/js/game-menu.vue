<template>
    <div id="game-menu" class="dropup">
        <button id="game-menu-btn" class="flex-center" v-bind:class="{expanded: expanded === true}" @click="toggle">
			<svg class="feather">
				<use xlink:href="feather-sprite.svg#more-horizontal"/>
			</svg>
		</button>
        <div id="game-menu-dropdown" class="dropup-content" v-show="expanded === true">
            <ul class="dropup-list">
				<slot></slot>
            </ul>
        </div>
    </div>
</template>
<script>
const Store = require('./state');
export default {
	name: 'GameMenu',
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
		senseClickOutside(event) {
			let clickedOutside;
			if(event.composedPath) {
				clickedOutside = event.composedPath().indexOf(document.getElementById('game-menu')) === -1;
			} else {
				// Edge, IE
				clickedOutside = Array.from(document.getElementById('game-menu').getElementsByTagName('*')).indexOf(event.target) === -1;
			}
			if(clickedOutside) {
				this.toggleHide();
			}
		}
	},
	mounted() {
		document.addEventListener('click', this.senseClickOutside);
	},
	beforeDestroy() {
		document.removeEventListener('click', this.senseClickOutside);
	}
};
</script>
