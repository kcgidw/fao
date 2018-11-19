const gameCanvas = require('../../common/game-canvas');
const RelativePoint = gameCanvas.RelativePoint;
const socket = require('./net').socket;
const MESSAGE = require('../../common/message');

var paintingDiv = document.getElementById('painting');
var canvas = document.getElementById('new-paint');
var oldPaint = document.getElementById('old-paint');
var ctx = canvas.getContext('2d');
var oldCtx = oldPaint.getContext('2d');

const HEIGHT_RATIO = 8/6;
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = CANVAS_WIDTH * HEIGHT_RATIO; // TODO more responsive, resizable for small viewports
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
oldPaint.width = CANVAS_WIDTH;
oldPaint.height = CANVAS_HEIGHT;

const DRAW_STATE = {
	'EMPTY': 'EMPTY',
	'PAINT': 'PAINT',
	'PREVIEW': 'PREVIEW',
	'SPECTATE': 'SPECTATE',
};
var curDrawState = DRAW_STATE.EMPTY;
var points = [];
var stroked = false;

function getRelativePointFromPointerEvent(canvasThis, e) {
	let pointerX = e.pageX - paintingDiv.offsetLeft;
	let pointerY = e.pageY - paintingDiv.offsetTop;
	let pt = new RelativePoint(pointerX / CANVAS_WIDTH, pointerY / CANVAS_HEIGHT);
	return pt;
}

function toggleInputs(containerString, disable) {
	$(`${containerString} .btn`).prop('disabled', disable);
	$(`${containerString} input`).prop('disabled', disable);
}
function setStroked(s) {
	stroked = s;
	toggleInputs('#in-game', !stroked);
}
setStroked(false);

$('#new-paint').on('pointerdown', function(e) {
	if(curDrawState === DRAW_STATE.EMPTY && FAO.myTurn()) {
		curDrawState = DRAW_STATE.PAINT;
		let newPt = getRelativePointFromPointerEvent(this, e);
		points.push(newPt);
	}
});
$('#new-paint').on('pointermove', function(e) {
	if(curDrawState === DRAW_STATE.PAINT && FAO.myTurn()) {
		let lastPt = points[points.length - 1];
		let newPt = getRelativePointFromPointerEvent(this, e);
		if(!lastPt.matches(newPt)) {
			points.push(newPt);
			drawStroke(ctx, points, true);
		}
	}
});
$('#new-paint').on('pointerup', function(e) {
	if(curDrawState === DRAW_STATE.PAINT && FAO.myTurn()) {
		if(points.length < 4) {
			redo();
		} else {
			setStroked(true);
			curDrawState = DRAW_STATE.PREVIEW;
			let newPt = getRelativePointFromPointerEvent(this, e);
			points.push(newPt);
			drawStroke(ctx, points, true);
			console.log(points);
		}
	}
});
// TODO pointerout event

function drawStroke(context, pts, color, shouldClear) {
	if(shouldClear) {
		context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	}
	context.strokeStyle = color;
	context.lineJoin = 'round';
	context.lineWidth = 4;
	context.beginPath();
	for(let pt of pts) {
		context.lineTo(pt.x * CANVAS_WIDTH, pt.y * CANVAS_HEIGHT);
	}
	context.stroke();
}

function redo() {
	curDrawState = DRAW_STATE.EMPTY;
	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	points = [];
	setStroked(false);
}
$('#in-game .btn.redo-drawing').on('click', function(e) {
	redo();
});
$('#in-game .btn.submit-drawing').on('click', function(e) {
	submitDrawing();
});
function submitDrawing() {
	socket.emit(MESSAGE.SUBMIT_STROKE, {
		points: points,
	});
}

socket.on(MESSAGE.NEW_TURN, function(data) {
	if(data.err) {
		return;
	} else {
		let state = data.roomState;
		let newStroke = state.strokes[state.strokes.length - 1];
		drawStroke(oldCtx, newStroke.points, FAO.game.getUserColor(newStroke.username), false);

		redo();
		toggleInputs('#in-game', !FAO.myTurn());
		if(FAO.myTurn()) {
			curDrawState = DRAW_STATE.EMPTY;
		} else {
			curDrawState = DRAW_STATE.SPECTATE;
		}
	}
});