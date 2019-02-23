class GameError {
	constructor(message, clientMessage) {
		this.name = GameError.name;
		this.message = message;
		this.clientMessage = clientMessage || message;
		console.log('GameError triggered: ' + this.toString());
	}
	static get name() {
		return 'GameError';
	}
	toString() {
		return this.message;
	}
}

module.exports = GameError;