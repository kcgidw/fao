const Util = require('./util');

class User {
	constructor(socket, name) {
		if(!Util.validateUsername(name)) {
			return undefined;
		}
		
		this.socket = socket;
		this.name = name;
		this.gameRoom = undefined;
		this.connected = true;
	}

	setGameRoom(gameRoom) {
		this.gameRoom = gameRoom;
	}
	setConnected(connected) {
		this.connected = connected;
	}
}

module.exports = User;