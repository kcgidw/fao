const Layer = require('./layer');
const RelativePoint = require('../../common/relative-point');

/* Canvas scaling */
const HEIGHT_RATIO = 8/6;
const maxCanvasWidth = 650;
const maxCanvasHeight = maxCanvasWidth * HEIGHT_RATIO;
const baseStrokeWidth = 10;
const canvasHorizontalMargin = 25;
const canvasVerticalMargin = 100;

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

	init() {
		this.canvasDiv = document.getElementById('drawing-pad');
		this[Layer.TOP].canvas = document.getElementById('new-paint');
		this[Layer.BOTTOM].canvas = document.getElementById('old-paint');
		this[Layer.TOP].context = this[Layer.TOP].canvas.getContext('2d');
		this[Layer.BOTTOM].context = this[Layer.BOTTOM].canvas.getContext('2d');
	},
	adjustSize() {
		let canvasWidthScaledByViewportWidth = Math.min((window.innerWidth - canvasHorizontalMargin * 2), maxCanvasWidth);
		let canvasWidthScaledByViewportHeight = Math.min((window.innerHeight - canvasVerticalMargin * 2), maxCanvasHeight) / HEIGHT_RATIO;
		this.canvasWidth = Math.min(canvasWidthScaledByViewportWidth, canvasWidthScaledByViewportHeight);
		this[Layer.TOP].canvas.width = this.canvasWidth;
		this[Layer.BOTTOM].canvas.width = this.canvasWidth;
		let targetHeight = this.canvasWidth * HEIGHT_RATIO;

		Array.from(document.getElementsByClassName('canvas-aligned')).forEach((el) => {
			el.style.width = this.canvasWidth + 'px';
		});
		this.canvasHeight = targetHeight;
		this.canvasDiv.style.width = this.canvasWidth + 'px';
		this.canvasDiv.style.height = targetHeight + 'px';
		this[Layer.TOP].canvas.height = targetHeight;
		this[Layer.BOTTOM].canvas.height = targetHeight;
		this[Layer.TOP].canvas.style.height = targetHeight + 'px';
		this[Layer.BOTTOM].canvas.style.height = targetHeight + 'px';

		this.strokeWidth = baseStrokeWidth * this.canvasWidth / maxCanvasWidth;
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