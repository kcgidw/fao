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

canvas.onmousedown = function(e) {
	curDrawState = DRAW_STATE.PAINT;
	var mouseX = e.pageX - this.offsetLeft;
	var mouseY = e.pageY - this.offsetTop;
	stroke.push(new RelativePoint(mouseX / CANVAS_WIDTH, mouseY / CANVAS_HEIGHT));
};
canvas.onmouseup = function(e) {
	curDrawState = DRAW_STATE.PREVIEW;
	var mouseX = e.pageX - this.offsetLeft;
	var mouseY = e.pageY - this.offsetTop;
	stroke.push(new RelativePoint(mouseX / CANVAS_WIDTH, mouseY / CANVAS_HEIGHT));
	drawStroke(stroke);
	stroke = [];
};
$('#drawingPad').mousemove(function(e){
	if(curDrawState === DRAW_STATE.PAINT) {
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		stroke.push(new RelativePoint(mouseX / CANVAS_WIDTH, mouseY / CANVAS_HEIGHT));
		drawStroke(stroke);
	}
  });

function drawStroke(stroke) {
	console.log(stroke);
	ctx.strokeStyle = '#AA1100';
	ctx.lineJoin = 'round';
	ctx.lineWidth = 5;
	ctx.beginPath();
	for(let pt of stroke) {
		ctx.lineTo(pt.x * CANVAS_WIDTH, pt.y * CANVAS_HEIGHT);
	}
	ctx.stroke();
}
