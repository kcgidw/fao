<template>
<div id="in-game" class="view">
	
	<div class="toggle-game-info"></div>
	<div id="game-info" class="chunk-narrow">
		<h2 class="prompt">{{promptText}}</h2>
		<h3 class="current-turn" :style="{color: userColor}">{{whoseTurnText}}</h3>
	</div>

	<div class="chunk-narrow">
		<div id="painting">
			<canvas id="new-paint" touch-action="none" 
			@pointerdown="pdown" @pointermove="pmove" @pointerup="endStroke" @pointerout="endStroke"></canvas>
			<canvas id="old-paint"></canvas>
		</div>
	</div>

	<div id="drawing-decision" class="chunk-narrow">
		<button class="btn secondary undo-drawing" @click="undo" v-show="!roundOver" :disabled="canvasState !== 'PREVIEW'">Undo</button>
		<button class="btn primary submit-drawing" @click="submit" v-show="!roundOver" :disabled="canvasState !== 'PREVIEW'">Submit</button>
		<div style="clear: both"></div>
		<button class="btn primary big new-round"
		  @click="newRound" v-show="roundOver" :disabled="!roundOver">New Round</button>
	</div>

</div>
</template>

<script>
const Store = require('./state');
const gameCanvas = require('../../common/game-canvas');
const RelativePoint = gameCanvas.RelativePoint;
const GAME_PHASE = require("../../common/game-phase");

/* Canvas scaling */
const HEIGHT_RATIO = 8/6;
const maxCanvasWidth = 500;
const maxCanvasHeight = maxCanvasWidth * HEIGHT_RATIO;
const minCanvasWidth = 250;

const CANVAS_STATE = {
	'EMPTY': 'EMPTY',
	'PAINT': 'PAINT',
	'PREVIEW': 'PREVIEW',
	'SPECTATE': 'SPECTATE',
};

const drawingPad = {
	topCanvas: undefined,
	bottomCanvas: undefined,
	topContext: undefined,
	bottomContext: undefined,
	canvasDiv: undefined,
	canvasWidth: undefined,
	canvasHeight: undefined,
	strokeWidth: undefined,
	init() {
		this.canvasDiv = document.getElementById('painting');
		this.topCanvas = document.getElementById('new-paint');
		this.bottomCanvas = document.getElementById('old-paint');
		this.topContext = this.topCanvas.getContext('2d');
		this.bottomContext = this.bottomCanvas.getContext('2d');

		let canvasWidthScaledByViewportWidth = Math.min((window.innerWidth - 50), maxCanvasWidth);
		let canvasWidthScaledByViewportHeight = Math.min((window.innerHeight - 200), maxCanvasHeight) / HEIGHT_RATIO;
		this.canvasWidth = Math.min(canvasWidthScaledByViewportWidth, canvasWidthScaledByViewportHeight);
		this.canvasHeight = this.canvasWidth * HEIGHT_RATIO;
		this.strokeWidth = (this.canvasWidth/maxCanvasWidth) * 9;

		this.canvasDiv.style.width = this.canvasWidth + 'px';
		this.canvasDiv.style.height = this.canvasHeight + 'px';
		this.topCanvas.width = this.canvasWidth;
		this.topCanvas.height = this.canvasHeight;
		this.bottomCanvas.width = this.canvasWidth;
		this.bottomCanvas.height = this.canvasHeight;

		document.getElementById('game-info').style['--maxCanvasWidth'] = drawingPad.canvasWidth;
	},
	getRelativePointFromPointerEvent(e) {
		let pointerX = e.pageX - this.canvasDiv.offsetLeft;
		let pointerY = e.pageY - this.canvasDiv.offsetTop;
		let relPt = new RelativePoint(pointerX / this.canvasWidth, pointerY / this.canvasHeight);
		return relPt;
	},
};

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
	},
	props: {
		gameState: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			canvasState: CANVAS_STATE.SPECTATE,
			stroke: strokeTracker,
			drawingPad: drawingPad,
		};
	},
	computed: {
		promptText() {
			return `${this.gameState.keyword} (${this.gameState.hint})`;
		},
		whoseTurnText() {
			return this.gameState.phase === GAME_PHASE.ROUND_OVER ? 'Voting time!' : `${this.gameState.whoseTurn}'s turn`;
		},
		userColor() {
			return this.gameState.getUserColor(this.gameState.whoseTurn);
		},
		roundOver() {
			return this.gameState.phase === GAME_PHASE.ROUND_OVER;
		}
	},
	watch: {
		['gameState.turn']() {
			this.onNewTurn();
		}
	},
	methods: {
		onNewTurn() {
			if(this.gameState.turn === 1) {
				this.clearCanvas(this.drawingPad.topContext);
				this.clearCanvas(this.drawingPad.bottomContext);
			}

			let newStroke = this.gameState.getMostRecentStroke();
			if(newStroke) {
				this.drawStroke(drawingPad.bottomContext, newStroke.points, this.gameState.getUserColor(newStroke.username), false);
			}
			if(Store.myTurn()) {
				this.canvasState = CANVAS_STATE.EMPTY;
			} else {
				this.canvasState = CANVAS_STATE.SPECTATE;
			}
		},
		undo() {
			this.stroke.reset();
			this.clearCanvas(drawingPad.topContext);
			this.canvasState = CANVAS_STATE.EMPTY;
		},
		submit() {
			if(Store.myTurn() && this.stroke.hasPoints()) {
				Store.submitStroke(this.stroke.points);

				this.stroke.reset();
				this.clearCanvas(drawingPad.topContext);
				this.canvasState = CANVAS_STATE.SPECTATE;
			}
		},
		newRound() {
			Store.submitStartGame();
		},
		pdown(e) {
			if(this.canvasState === CANVAS_STATE.EMPTY && Store.myTurn()) {
				this.canvasState = CANVAS_STATE.PAINT;
				let newPt = drawingPad.getRelativePointFromPointerEvent(e);
				strokeTracker.addPoint(newPt);
			}
		},
		pmove(e) {
			if(this.canvasState === CANVAS_STATE.PAINT && Store.myTurn()) {
				let div = document.getElementById('new-paint');
				let lastPt = strokeTracker.lastPoint();
				let newPt = drawingPad.getRelativePointFromPointerEvent(e);
				if(!lastPt.matches(newPt)) {
					strokeTracker.addPoint(newPt);
					this.drawStroke(drawingPad.topContext, strokeTracker.points, 'black', false);
				}
			}
		},
		endStroke(e) {
			if(this.canvasState === CANVAS_STATE.PAINT && Store.myTurn()) {
				if(strokeTracker.validateStrokeDistance()) {
					this.canvasState = CANVAS_STATE.PREVIEW;
					let newPt = drawingPad.getRelativePointFromPointerEvent(e);
					strokeTracker.addPoint(newPt);
					this.drawStroke(drawingPad.topContext, strokeTracker.points, 'black', true);
				} else {
					this.clearCanvas(drawingPad.topContext);
					this.canvasState = CANVAS_STATE.EMPTY;
					strokeTracker.reset();
				}
			}
		},
		drawStroke(canvasContext, points, color, clearCanvasFirst) {
			if(clearCanvasFirst) {
				this.clearCanvas(canvasContext);
			}
			canvasContext.strokeStyle = color;
			canvasContext.lineJoin = 'round';
			canvasContext.lineWidth = drawingPad.strokeWidth;
			canvasContext.beginPath();
			// console.log(pts);
			for(let pt of points) {
				canvasContext.lineTo(pt.x * drawingPad.canvasWidth, pt.y * drawingPad.canvasHeight);
			}
			canvasContext.stroke();
		},
		clearCanvas(canvasContext) {
			canvasContext.clearRect(0,0, drawingPad.canvasWidth, drawingPad.canvasHeight);
		}
	},
	mounted() {
		this.$nextTick(function() {
			drawingPad.init();
			this.onNewTurn(); 
		});
	}
};
</script>
