const _ = require('lodash');

class ClientGame {
	constructor() {}
	static compile(gameRoom, canViewFaker) {
		let game = new ClientGame();
		game.roomCode = gameRoom.roomCode;
		game.users = _.map(gameRoom.users, (u) => (u.name));
		game.host = gameRoom.host.name;
		game.state = gameRoom.state;
		game.turn = gameRoom.turn;
		game.keyword = gameRoom.keyword;
		game.hint = gameRoom.hint;
		game.faker = canViewFaker ? gameRoom.faker.name : undefined; // hide from non-fakers
		return game;
	}
	static fromJson(json) {
		let game = new ClientGame();
		Object.assign(game, json);
		return game;
	}
    
}

module.exports = ClientGame;