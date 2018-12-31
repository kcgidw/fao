class GameError {
	constructor(message) {
		this.name = GameError.name;
		this.message = message;
		console.log('GameError triggered: ' + this.toString());
	}
	static get name() {
		return 'GameError';
	}
	toString() {
		return this.name + ': ' + this.message;
	}
}

module.exports = GameError;