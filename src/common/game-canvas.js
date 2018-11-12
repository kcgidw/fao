
/*
X-Y points with values ranging (0, 0) to (1.0, 1.0)
*/
class RelativePoint {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	matches(other) {
		return negligible(this.x, other.x) && negligible(this.y, other.y);
	}
}
function negligible(a, b, thresh = 0.00001) {
	return Math.abs(a - b) < thresh;
}

class Stroke {
	constructor(player, points) {
		this.player = player;
		this.points = points; // array of points to connect
	}
}

export {
	RelativePoint, Stroke
}