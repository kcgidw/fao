const gameCanvas = require('../../common/game-canvas');
const RelativePoint = gameCanvas.RelativePoint;

var canvas = document.getElementById('drawingPad');
var ctx = canvas.getContext('2d');

const HEIGHT_RATIO = 8/6;
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = CANVAS_WIDTH * HEIGHT_RATIO;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const DRAW_STATE = {
	'BEGIN': 'BEGIN',
	'PAINT': 'PAINT',
	'PREVIEW': 'PREVIEW',
};
var curDrawState = DRAW_STATE.BEGIN;
var stroke = [];

function getRelativePointFromPointerEvent(canvasThis, e) {
	var pointerX = e.pageX - canvasThis.offsetLeft;
	var pointerY = e.pageY - canvasThis.offsetTop;
	var pt = new RelativePoint(pointerX / CANVAS_WIDTH, pointerY / CANVAS_HEIGHT);
	return pt;
}

$('#drawingPad').on('pointerdown', function(e){
	// if(curDrawState === DRAW_STATE.BEGIN) {
		curDrawState = DRAW_STATE.PAINT;
		var newPt = getRelativePointFromPointerEvent(this, e);
		stroke.push(newPt);
	// }
});
$('#drawingPad').on('pointermove', function(e){
	if(curDrawState === DRAW_STATE.PAINT) {
		var lastPt = stroke[stroke.length - 1];
		var newPt = getRelativePointFromPointerEvent(this, e);
		if(!lastPt.matches(newPt)) {
			stroke.push(newPt);
			drawStroke(stroke);
		}
	}
});
$('#drawingPad').on('pointerup', function(e){
	if(curDrawState === DRAW_STATE.PAINT) {
		curDrawState = DRAW_STATE.PREVIEW;
		drawStroke(stroke);
		stroke = [];
	}
});
// TODO pointerout event

function drawStroke(stroke) {
	console.log(stroke);
	ctx.strokeStyle = '#AA1100';
	ctx.lineJoin = 'round';
	ctx.lineWidth = 4;
	ctx.beginPath();
	for(let pt of stroke) {
		ctx.lineTo(pt.x * CANVAS_WIDTH, pt.y * CANVAS_HEIGHT);
	}
	// ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.stroke();
}
