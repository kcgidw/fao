import Layer from './layer';
import RelativePoint from '../../common/relative-point';

/* Canvas scaling */
const HEIGHT_RATIO = 8 / 6;
const MAX_CANVAS_W = 650;
const MAX_CANVAS_H = MAX_CANVAS_W * HEIGHT_RATIO;
const BASE_STROKE_WIDTH = 10;
const CANVAS_MARGIN_HOR = 20;
const CANVAS_MARGIN_VER = 96;

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
		let canvasWidthScaledByViewportWidth = Math.min(
			window.innerWidth - CANVAS_MARGIN_HOR * 2,
			MAX_CANVAS_W
		);
		let canvasWidthScaledByViewportHeight =
			Math.min(window.innerHeight - CANVAS_MARGIN_VER * 2, MAX_CANVAS_H) / HEIGHT_RATIO;
		this.canvasWidth = Math.min(
			canvasWidthScaledByViewportWidth,
			canvasWidthScaledByViewportHeight
		);
		this[Layer.TOP].canvas.width = this.canvasWidth;
		this[Layer.BOTTOM].canvas.width = this.canvasWidth;
		let targetHeight = this.canvasWidth * HEIGHT_RATIO;

		this.canvasHeight = targetHeight;
		this.canvasDiv.style.width = this.canvasWidth + 'px';
		this.canvasDiv.style.height = targetHeight + 'px';
		this[Layer.TOP].canvas.height = targetHeight;
		this[Layer.BOTTOM].canvas.height = targetHeight;
		this[Layer.TOP].canvas.style.height = targetHeight + 'px';
		this[Layer.BOTTOM].canvas.style.height = targetHeight + 'px';
		Array.from(document.getElementsByClassName('canvas-aligned')).forEach((el) => {
			el.style.width = this.canvasWidth + 'px';
		});

		this.strokeWidth = (BASE_STROKE_WIDTH * this.canvasWidth) / MAX_CANVAS_W;
	},

	getRelativePointFromPointerEvent(e) {
		let pointerX = e.pageX - this.canvasDiv.offsetLeft;
		let pointerY = e.pageY - this.canvasDiv.offsetTop;
		let relPt = new RelativePoint(pointerX / this.canvasWidth, pointerY / this.canvasHeight);
		return relPt;
	},

	clearLayer(layer) {
		this[layer].context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	},

	drawStroke(layer, points, color) {
		let context = this[layer].context;
		context.strokeStyle = color;
		context.lineJoin = 'round';
		context.lineWidth = this.strokeWidth;
		context.lineCap = 'round';
		context.beginPath();
		// console.log(pts);
		for (let pt of points) {
			context.lineTo(pt.x * this.canvasWidth, pt.y * this.canvasHeight);
		}
		context.stroke();
	},
};

export default drawingPad;
