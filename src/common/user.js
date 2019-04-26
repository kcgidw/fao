const Util = require('./util');

class User {
	constructor(socket, name) {
		if(!Util.validateUsername(name)) {
			return undefined;
		}

		this.socket = socket;
		this.name = name;
		this.gameRoom = undefined; // TODO currently this references the room obj. Change this to just the code, to avoid circular refs
	}

	setGameRoom(gameRoom) {
		this.gameRoom = gameRoom;
	}
	get connected() {
		return Boolean(this.socket && this.socket.connected);
	}
	get logName() {
		return `<${this.name}>`;
	}
}

module.exports = User;