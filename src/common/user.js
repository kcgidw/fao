class User {
	constructor(socket, name) {
		if(!User.validateName(name)) {
			return undefined;
		}
		
		this.socket = socket;
		this.name = name;
		this.gameRoom = undefined;
	}

	setGameRoom(gameRoom) {
		this.gameRoom = gameRoom;
	}

	static validateName(name) {
		// TODO
		return true;
	}
}

module.exports = User;