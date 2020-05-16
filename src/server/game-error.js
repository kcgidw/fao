import debugLog from './debug-log';

/**
 * Error object for user and game state validation
 * message: Server logs
 * clientMessage: Sent to client (optional)
 */

class GameError {
	constructor(message, clientMessage, debugOnly = false) {
		this.name = GameError.name;
		this.message = message;
		this.clientMessage = clientMessage || message;

		if (debugOnly) {
			debugLog('GameError triggered: ' + this.toString());
		} else {
			console.log('GameError triggered: ' + this.toString());
		}
	}

	static get name() {
		return 'GameError';
	}

	toString() {
		return this.message;
	}
}
export default GameError;
