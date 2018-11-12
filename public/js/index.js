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


/*
X-Y points with values ranging (0,0) to (1.0,1.0)
*/
class RelativePoint {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Stroke {
	constructor(player, points) {
		this.player = player;
		this.points = points; // array of points to connect
	}
}

class StrokeHistory {
	constructor() {
		this.strokes = [];
	}
	getStrokesByPlayer(player) {
		return this.strokes.find((s) => (s.player === player));
	}
}
