const gameCanvas = require('../../common/game-canvas');
const RelativePoint = gameCanvas.RelativePoint;

var canvas = document.getElementById('drawingPad');
var ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const DRAW_STATE = {
	'BEGIN': 'BEGIN',
	'PAINT': 'PAINT',
	'PREVIEW': 'PREVIEW',
};
var curDrawState = DRAW_STATE.BEGIN;
var stroke = [];

function getRelativePointFromMouseEvent(canvasThis, e) {
	var mouseX = e.pageX - canvasThis.offsetLeft;
	var mouseY = e.pageY - canvasThis.offsetTop;
	var pt = new RelativePoint(mouseX / CANVAS_WIDTH, mouseY / CANVAS_HEIGHT);
	return pt;
}

$('#drawingPad').mousedown(function(e){
	// if(curDrawState === DRAW_STATE.BEGIN) {
		curDrawState = DRAW_STATE.PAINT;
		var newPt = getRelativePointFromMouseEvent(this, e);
		stroke.push(newPt);
	// }
});
$('#drawingPad').mousemove(function(e){
	if(curDrawState === DRAW_STATE.PAINT) {
		var lastPt = stroke[stroke.length - 1];
		var newPt = getRelativePointFromMouseEvent(this, e);
		if(!lastPt.matches(newPt)) {
			stroke.push(newPt);
			drawStroke(stroke);
		}
	}
});
$('#drawingPad').mouseup(function(e){
	if(curDrawState === DRAW_STATE.PAINT) {
		curDrawState = DRAW_STATE.PREVIEW;
		stroke = [];
	}
});
// TODO mouseout event

function drawStroke(stroke) {
	console.log(stroke);
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.strokeStyle = '#AA1100';
	ctx.lineJoin = 'round';
	ctx.lineWidth = 4;
	ctx.beginPath();
	for(let pt of stroke) {
		ctx.lineTo(pt.x * CANVAS_WIDTH, pt.y * CANVAS_HEIGHT);
	}
	ctx.stroke();
}
