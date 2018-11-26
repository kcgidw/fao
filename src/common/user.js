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
}

module.exports = User;