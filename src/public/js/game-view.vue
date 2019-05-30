<template>
<div id="in-game" class="view">
	<div class="view-container">
		<player-statuses @close="hidePlayerStatuses" :users="gameState.users" v-show="playerStatusesDialogVisible"></player-statuses>
		<confirmation id="confirm-skip-dialog" v-show="skipRoundConfirmationDialogVisible" @close="hideSkipRoundConfirmationDialog" @confirm="skip">
			<h3>Skip This Round</h3>
			<div>
				This will end the current round.
			</div>
		</confirmation>
		<confirmation id="confirm-setup-dialog" v-show="setupConfirmationDialogVisible" @close="hideSetupConfirmationDialog" @confirm="setup">
			<h3>Exit to Setup</h3>
			<div>
				By returning to setup, you can add/remove players.
				<br>
				This will end the current round.
			</div>
		</confirmation>
		<div class="stripe">
			<div id="game-info" class="stripe-content canvas-aligned">
				<h1 class="prompt" v-show="promptVisible">{{promptText}}</h1>
				<h3 class="current-turn" :style="{color: userColor}">{{whoseTurnText}}</h3>
			</div>
		</div>
		<div class="stripe flex-center">
			<div id="drawing-pad" class="stripe-content">
				<connection-overlay :gameConnection="gameConnection"></connection-overlay>
				<canvas id="new-paint"
					touch-action="none"
					@pointerdown="pdown" @pointermove="pmove" @pointerup="endStroke" @pointerout="endStroke"
				></canvas>
				<canvas id="old-paint"></canvas>
			</div>
		</div>
		<div id="drawing-actions" class="stripe flex-center">
			<div class="stripe-content flex-center canvas-aligned">
				<div id="drawing-actions-right" class="fill-space">
				</div>
				<div id="drawing-actions-center">
					<button class="btn primary big" @click="newRound" v-show="roundOver" :disabled="!roundOver">
							New Round
					</button>
					<button class="btn primary submit-drawing" @click="submit" v-show="!roundOver" :disabled="!actionsEnabled">Submit</button>
					<button class="btn secondary undo-drawing" @click="undo" v-show="!roundOver" :disabled="!actionsEnabled">Undo</button>
				</div>
				<div id="drawing-actions-left" class="fill-space">
					<game-menu :items="menuItems"></game-menu>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
const Store = require('./state');
const VIEW = require('./view');
const Layer = require('./layer');
const RelativePoint = require('../../common/relative-point');
const GAME_PHASE = require('../../common/game-phase');
const CONNECTION_STATE = require('./connection-state');
import ConnectionOverlay from './connection-overlay';
import GameMenu from './game-menu';
import PlayerStatuses from './player-statuses';
import Confirmation from './confirmation';

const CanvasState = {
	EMPTY: 'EMPTY',
	PAINT: 'PAINT',
	PREVIEW: 'PREVIEW',
	SPECTATE: 'SPECTATE',
};

const drawingPad = require('./drawing-pad');

const strokeTracker = {
	points: [],
	maxCount: 5000,
	strokeLength: 0,
	addPoint: function(p) {
		if(this.points.length < this.maxCount) {
			this.points.push(p);
		}
		return this.points;
	},
	lastPoint: function() {
		let prevPt = this.points[this.points.length - 1];
		return prevPt;
	},
	reset: function() {
		this.points = [];
		this.strokeLength = 0;
	},
	validateStrokeDistance: function() { // TODO validate by relativeLength?
		if(this.points.length < 2) {
			return false;
		}
		// console.log(this.points.length);
		const minLength = 0.02;
		let dist = 0;
		for(let i=1; i<this.points.length; i++) {
			let prevPt = this.points[i-1];
			let curPt = this.points[i];
			let a = prevPt.x - curPt.x;
			let b = prevPt.y - curPt.y;
			dist += Math.sqrt(a*a + b*b);
			// console.log(dist);
			if(dist > minLength) {
				return true;
			}
		}
		return false;
	},
	hasPoints: function() {
		return this.points.length > 0;
	}
};

export default {
	name: 'GameView',
	components: {
		ConnectionOverlay,
		GameMenu,
		PlayerStatuses,
		Confirmation,
	},
	props: {
		gameConnection: {
			type: String,
			required: true,
		},
		gameState: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			canvasState: CanvasState.SPECTATE,
			stroke: strokeTracker,
			drawingPad: drawingPad,
			promptVisible: true,
			skipRoundConfirmationDialogVisible: false,
			setupConfirmationDialogVisible: false,
			menuItems: [
				{
					text: 'Toggle prompt visibility',
					action: this.togglePrompt,
				}, {
					text: 'View players',
					action: this.showPlayerStatuses,
				}, {
					text: 'break1',
					hr: true,
				}, {
				// 	text: 'Rules',
				// 	action: this.rules,
				// }, {
				// 	text: 'break2',
				// 	hr: true,
				// }, {
					text: 'Skip this round',
					action: this.showSkipRoundConfirmationDialog,
				}, {
					text: 'Exit to setup',
					action: this.showSetupConfirmationDialog,
				},
			],
			playerStatusesDialogVisible: false,
		};
	},
	computed: {
		promptText() {
			return `${this.gameState.keyword} (${this.gameState.hint})`;
		},
		whoseTurnText() {
			return this.gameState.phase === GAME_PHASE.VOTE ? 'Time to vote!' : `${this.gameState.whoseTurn}'s turn`;
		},
		userColor() {
			return this.gameState.getUserColor(this.gameState.whoseTurn);
		},
		roundOver() {
			return this.gameState.phase === GAME_PHASE.VOTE;
		},
		actionsEnabled() {
			return (
				this.canvasState === 'PREVIEW' &&
				this.gameConnection === CONNECTION_STATE.CONNECT
			);
		},
		roundAndTurn() {
			return this.gameState.round + '-' + this.gameState.turn;
		}
	},
	watch: {
		roundAndTurn() {
			this.reset();
		},
		['gameState.round']() {
			this.promptVisible = true;
		},
	},
	methods: {
		reset() {
			if(this.gameState.turn === 1) {
				drawingPad.clearLayer(Layer.BOTTOM);
			}

			drawingPad.clearLayer(Layer.TOP);
			this.stroke.reset();
			// TODO draw only the strokes that haven't been drawn yet (keeping connection loss in mind)
			for(let stroke of this.gameState.strokes) {
				drawingPad.drawStroke(Layer.BOTTOM, stroke.points, this.gameState.getUserColor(stroke.username));
			}

			if(Store.myTurn()) {
				this.canvasState = CanvasState.EMPTY;
			} else {
				this.canvasState = CanvasState.SPECTATE;
			}
		},
		undo() {
			this.stroke.reset();
			drawingPad.clearLayer(Layer.TOP);
			this.canvasState = CanvasState.EMPTY;
		},
		submit() {
			if(Store.myTurn() && this.stroke.hasPoints()) {
				Store.submitStroke(this.stroke.points);

				this.stroke.reset();
				this.canvasState = CanvasState.SPECTATE;
			}
		},
		newRound() {
			Store.submitStartGame();
		},
		pdown(e) {
			if(this.canvasState === CanvasState.EMPTY && Store.myTurn()) {
				this.canvasState = CanvasState.PAINT;
				let newPt = drawingPad.getRelativePointFromPointerEvent(e);
				strokeTracker.addPoint(newPt);
			}
		},
		pmove(e) {
			if(this.canvasState === CanvasState.PAINT && Store.myTurn()) {
				let div = document.getElementById('new-paint');
				let lastPt = strokeTracker.lastPoint();
				let newPt = drawingPad.getRelativePointFromPointerEvent(e);
				if(!lastPt.matches(newPt)) {
					strokeTracker.addPoint(newPt);
					drawingPad.drawStroke(Layer.TOP, strokeTracker.points, 'black');
				}
			}
		},
		endStroke(e) {
			if(this.canvasState === CanvasState.PAINT && Store.myTurn()) {
				if(strokeTracker.validateStrokeDistance()) {
					this.canvasState = CanvasState.PREVIEW;
					let lastPt = strokeTracker.lastPoint();
					let newPt = drawingPad.getRelativePointFromPointerEvent(e);
					if(!lastPt.matches(newPt)) {
						strokeTracker.addPoint(newPt);
						drawingPad.drawStroke(Layer.TOP, strokeTracker.points, 'black');
					}
				} else {
					drawingPad.clearLayer(Layer.TOP);
					this.canvasState = CanvasState.EMPTY;
					strokeTracker.reset();
				}
			}
		},
		resize() {
			drawingPad.adjustSize();
			drawingPad.clearLayer(Layer.TOP);
			drawingPad.drawStroke(Layer.TOP, strokeTracker.points, 'black');
			drawingPad.clearLayer(Layer.BOTTOM);
			for(let stroke of this.gameState.strokes) {
				drawingPad.drawStroke(Layer.BOTTOM, stroke.points, this.gameState.getUserColor(stroke.username));
			}
		},
		togglePrompt() {
			this.promptVisible = !this.promptVisible;
		},
		showSkipRoundConfirmationDialog() {
			this.skipRoundConfirmationDialogVisible = true;
		},
		showSetupConfirmationDialog() {
			this.setupConfirmationDialogVisible = true;
		},
		hideSkipRoundConfirmationDialog() {
			this.skipRoundConfirmationDialogVisible = false;
		},
		hideSetupConfirmationDialog() {
			this.setupConfirmationDialogVisible = false;
		},
		skip() {
			Store.submitSkipRound();
			this.hideSkipRoundConfirmationDialog();
		},
		setup() {
			Store.submitReturnToSetup();
			this.hideSetupConfirmationDialog();
		},
		showPlayerStatuses() {
			this.playerStatusesDialogVisible = true;
		},
		hidePlayerStatuses() {
			this.playerStatusesDialogVisible = false;
		},
		rules() {
			Store.setView(VIEW.RULES);
		}
	},
	mounted() {
		this.$nextTick(function() {
			drawingPad.init();
			drawingPad.adjustSize();
			this.reset();
		});
		window.addEventListener('resize', this.resize);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.resize);
	}
};
</script>
