const Layer = require('./layer');
const RelativePoint = require('../../common/relative-point');

/* Canvas scaling */
const HEIGHT_RATIO = 8/6;
const maxCanvasWidth = 500;
const maxCanvasHeight = maxCanvasWidth * HEIGHT_RATIO;

const drawingPad = {
	[Layer.TOP]: {
		canvas: undefined,
		context: undefined,
	},
	[Layer.BOTTOM]: {
		canvas: undefined,
		context: undefined,
	},
	canvasDiv: undefined,
	canvasWidth: undefined,
	canvasHeight: undefined,
	strokeWidth: undefined,

	adjustSize() {
		this.canvasDiv = document.getElementById('painting');

		this[Layer.TOP].canvas = document.getElementById('new-paint');
		this[Layer.BOTTOM].canvas = document.getElementById('old-paint');
		this[Layer.TOP].context = this[Layer.TOP].canvas.getContext('2d');
		this[Layer.BOTTOM].context = this[Layer.BOTTOM].canvas.getContext('2d');

		let canvasWidthScaledByViewportWidth = Math.min((window.innerWidth - 50), maxCanvasWidth);
		let canvasWidthScaledByViewportHeight = Math.min((window.innerHeight - 200), maxCanvasHeight) / HEIGHT_RATIO;
		this.canvasWidth = Math.min(canvasWidthScaledByViewportWidth, canvasWidthScaledByViewportHeight);
		this.canvasHeight = this.canvasWidth * HEIGHT_RATIO;
		this.strokeWidth = (this.canvasWidth/maxCanvasWidth) * 9;

		this.canvasDiv.style.width = this.canvasWidth + 'px';
		this.canvasDiv.style.height = this.canvasHeight + 'px';
		this[Layer.TOP].canvas.width = this.canvasWidth;
		this[Layer.TOP].canvas.height = this.canvasHeight;
		this[Layer.BOTTOM].canvas.width = this.canvasWidth;
		this[Layer.BOTTOM].canvas.height = this.canvasHeight;

		document.getElementById('in-game-container').style['--maxCanvasWidth'] = drawingPad.canvasWidth;
	},

	getRelativePointFromPointerEvent(e) {
		let pointerX = e.pageX - this.canvasDiv.offsetLeft;
		let pointerY = e.pageY - this.canvasDiv.offsetTop;
		let relPt = new RelativePoint(pointerX / this.canvasWidth, pointerY / this.canvasHeight);
		return relPt;
	},

	clearLayer(layer) {
		this[layer].context.clearRect(0,0, this.canvasWidth, this.canvasHeight);
	},

	drawStroke(layer, points, color) {
		let context = this[layer].context;
		context.strokeStyle = color;
		context.lineJoin = 'round';
		context.lineWidth = this.strokeWidth;
		context.beginPath();
		// console.log(pts);
		for(let pt of points) {
			context.lineTo(pt.x * this.canvasWidth, pt.y * this.canvasHeight);
		}
		context.stroke();
	},
};

module.exports = drawingPad;