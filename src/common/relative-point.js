const { negligible } = require("./util");

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

module.exports = RelativePoint;