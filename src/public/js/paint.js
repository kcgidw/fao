const gameCanvas = require('../../common/game-canvas');
const RelativePoint = gameCanvas.RelativePoint;

var paintingDiv = document.getElementById('painting');
var canvas = document.getElementById('new-paint');
var oldPaint = document.getElementById('old-paint');
var ctx = canvas.getContext('2d');

const HEIGHT_RATIO = 8/6;
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = CANVAS_WIDTH * HEIGHT_RATIO;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
oldPaint.width = CANVAS_WIDTH;
oldPaint.height = CANVAS_HEIGHT;

const DRAW_STATE = {
	'BEGIN': 'BEGIN',
	'PAINT': 'PAINT',
	'PREVIEW': 'PREVIEW',
};
var curDrawState = DRAW_STATE.BEGIN;
var stroke = [];
var stroked = false;

function getRelativePointFromPointerEvent(canvasThis, e) {
	var pointerX = e.pageX - paintingDiv.offsetLeft;
	var pointerY = e.pageY - paintingDiv.offsetTop;
	var pt = new RelativePoint(pointerX / CANVAS_WIDTH, pointerY / CANVAS_HEIGHT);
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
	// if(curDrawState === DRAW_STATE.BEGIN) {
	curDrawState = DRAW_STATE.PAINT;
	var newPt = getRelativePointFromPointerEvent(this, e);
	stroke.push(newPt);
	// }
});
$('#new-paint').on('pointermove', function(e) {
	if(curDrawState === DRAW_STATE.PAINT) {
		var lastPt = stroke[stroke.length - 1];
		var newPt = getRelativePointFromPointerEvent(this, e);
		if(!lastPt.matches(newPt)) {
			stroke.push(newPt);
			drawStroke(ctx, stroke);
		}
	}
});
$('#new-paint').on('pointerup', function(e) {
	if(curDrawState === DRAW_STATE.PAINT) {
		curDrawState = DRAW_STATE.PREVIEW;
		drawStroke(ctx, stroke);
		setStroked(true);
		console.log(stroke);
	}
});
// TODO pointerout event

function drawStroke(context, stroke) {
	context.strokeStyle = '#AA1100';
	context.lineJoin = 'round';
	context.lineWidth = 4;
	context.beginPath();
	for(let pt of stroke) {
		context.lineTo(pt.x * CANVAS_WIDTH, pt.y * CANVAS_HEIGHT);
	}
	context.stroke();
}

function redo() {
	curDrawState = DRAW_STATE.BEGIN;
	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	stroke = [];
	setStroked(false);
}
$('#in-game .btn.redo-drawing').on('click', function(e) {
	redo();
});