const Util = require('./util');

class User {
	constructor(socket, name) {
		if(!Util.validateUsername(name)) {
			return undefined;
		}

		this.socket = socket;
		this.name = name;
		this.gameRoom = undefined;
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