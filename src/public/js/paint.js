const gameCanvas = require('../../common/game-canvas');
const RelativePoint = gameCanvas.RelativePoint;
const GAME_PHASE = require('../../common/game-phase');
const MESSAGE = require('../../common/message');

var paintingDiv = document.getElementById('painting');
var canvas = document.getElementById('new-paint');
var oldPaint = document.getElementById('old-paint');
var ctx = canvas.getContext('2d');
var oldCtx = oldPaint.getContext('2d');

/* Canvas scaling */
const HEIGHT_RATIO = 8/6;
const maxCanvasWidth = 500;
const maxCanvasHeight = maxCanvasWidth * HEIGHT_RATIO;
const minCanvasWidth = 250;
let CANVAS_WIDTH, CANVAS_HEIGHT, STROKE_WIDTH;

function scaleCanvas() {
	let canvasWidthScaledByViewportWidth = Math.min((window.innerWidth - 50), maxCanvasWidth);
	let canvasWidthScaledByViewportHeight = Math.min((window.innerHeight - 200), maxCanvasHeight) / HEIGHT_RATIO;
	CANVAS_WIDTH = Math.min(canvasWidthScaledByViewportWidth, canvasWidthScaledByViewportHeight);
	CANVAS_HEIGHT = CANVAS_WIDTH * HEIGHT_RATIO;
	STROKE_WIDTH = (CANVAS_WIDTH/maxCanvasWidth) * 9;

	paintingDiv.style.width = CANVAS_WIDTH + 'px';
	paintingDiv.style.height = CANVAS_HEIGHT + 'px';
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	oldPaint.width = CANVAS_WIDTH;
	oldPaint.height = CANVAS_HEIGHT;

	$('#game-info').css('--maxCanvasWidth', CANVAS_WIDTH); // also scale the game info div
}
scaleCanvas();

const DRAW_STATE = {
	'EMPTY': 'EMPTY',
	'PAINT': 'PAINT',
	'PREVIEW': 'PREVIEW',
	'SPECTATE': 'SPECTATE',
};
var curDrawState = DRAW_STATE.EMPTY;

var strokeTracker = {
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
	validateStrokeDistance: function() {
		if(this.points.length < 2) {
			return false;
		}
		console.log(this.points.length);
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

let undoBtn = $('div#in-game .undo-drawing');
let submitBtn = $('#in-game .btn.submit-drawing');
let newRoundBtn = $('#in-game .new-round');
function determineStyles() {
	let disableUndoButton = !strokeTracker.hasPoints();
	undoBtn.toggle(Boolean(FAO.game && FAO.game.phase === GAME_PHASE.PLAY));
	submitBtn.toggle(Boolean(FAO.game && FAO.game.phase === GAME_PHASE.PLAY));
	undoBtn.prop('disabled', disableUndoButton);
	submitBtn.prop('disabled', disableUndoButton);
	newRoundBtn.toggle(Boolean(FAO.game && FAO.game.phase === GAME_PHASE.ROUND_OVER));
	newRoundBtn.prop('disabled', !(FAO.game && FAO.game.phase === GAME_PHASE.ROUND_OVER));
}
determineStyles();

/* ============================================================================
	Drawing 
============================================================================ */

function getRelativePointFromPointerEvent(canvasThis, e) {
	let pointerX = e.pageX - paintingDiv.offsetLeft;
	let pointerY = e.pageY - paintingDiv.offsetTop;
	let pt = new RelativePoint(pointerX / CANVAS_WIDTH, pointerY / CANVAS_HEIGHT);
	return pt;
}
$('#new-paint').on('pointerdown', function(e) {
	if(curDrawState === DRAW_STATE.EMPTY && FAO.myTurn()) {
		curDrawState = DRAW_STATE.PAINT;
		let newPt = getRelativePointFromPointerEvent(this, e);
		strokeTracker.addPoint(newPt);
	}
});
$('#new-paint').on('pointermove', function(e) {
	if(curDrawState === DRAW_STATE.PAINT && FAO.myTurn()) {
		let lastPt = strokeTracker.lastPoint();
		let newPt = getRelativePointFromPointerEvent(this, e);
		if(!lastPt.matches(newPt)) {
			strokeTracker.addPoint(newPt);
			drawStroke(ctx, strokeTracker.points, true);
		}
	}
});
function endStroke(e) {
	if(curDrawState === DRAW_STATE.PAINT && FAO.myTurn()) {
		if(!strokeTracker.validateStrokeDistance()) {
			clearFront();
		} else {
			curDrawState = DRAW_STATE.PREVIEW;
			let newPt = getRelativePointFromPointerEvent(this, e);
			strokeTracker.addPoint(newPt);
			drawStroke(ctx, strokeTracker.points, true);
		}
	}
	determineStyles();
}
$('#new-paint').on('pointerup', function(e) {
	endStroke(e);
});
$('#new-paint').on('pointerout', function(e) {
	endStroke(e);
});

function drawStroke(context, pts, color, shouldClear) {
	if(shouldClear) {
		context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	}
	context.strokeStyle = color;
	context.lineJoin = 'round';
	context.lineWidth = STROKE_WIDTH;
	context.beginPath();
	// console.log(pts);
	for(let pt of pts) {
		context.lineTo(pt.x * CANVAS_WIDTH, pt.y * CANVAS_HEIGHT);
	}
	context.stroke();
}

function clearFront() {
	curDrawState = DRAW_STATE.EMPTY;
	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	strokeTracker.reset();
}
function clearBack() {
	oldCtx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}

/* ============================================================================
	Events
============================================================================ */

function submitDrawing() {
	if(strokeTracker.hasPoints() && strokeTracker.validateStrokeDistance()) {
		window.socket.emit(MESSAGE.SUBMIT_STROKE, {
			points: strokeTracker.points,
		});
	}
}
undoBtn.on('click', function(e) {
	clearFront();
	determineStyles();
});
submitBtn.on('click', function(e) {
	submitDrawing();
	determineStyles();
});
newRoundBtn.on('click', function(e) {
	window.socket.emit(MESSAGE.START_GAME, {});
});

window.EE.on(MESSAGE.START_GAME, function(data) {
	clearFront();
	clearBack();
	if(FAO.myTurn()) {
		curDrawState = DRAW_STATE.EMPTY;
	} else {
		curDrawState = DRAW_STATE.SPECTATE;
	}
	determineStyles();
});

window.EE.on(MESSAGE.NEW_TURN, function(data) {
	let state = data.roomState;
	let newStroke = state.strokes[state.strokes.length - 1];
	drawStroke(oldCtx, newStroke.points, FAO.game.getUserColor(newStroke.username), false);
	clearFront();
	if(FAO.myTurn()) {
		curDrawState = DRAW_STATE.EMPTY;
	} else {
		curDrawState = DRAW_STATE.SPECTATE;
	}
	determineStyles();
});