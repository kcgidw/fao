const _ = require('lodash');
const COLOR = require('./color');

class ClientGame {
	constructor() {}
	static compile(gameRoom, canViewFaker) {
		let game = new ClientGame();
		game.roomCode = gameRoom.roomCode;
		game.usernames = _.map(gameRoom.users, (u) => (u.name));
		game.host = gameRoom.host.name;
		game.state = gameRoom.state;
		game.turn = gameRoom.turn;
		game.keyword = gameRoom.keyword;
		game.hint = gameRoom.hint;
		game.faker = canViewFaker ? gameRoom.faker.name : undefined; // hide from non-fakers
		game.strokes = gameRoom.strokes;
		return game;
	}
	static fromJson(json) {
		let game = new ClientGame();
		Object.assign(game, json);
		return game;
	}
	whoseTurn() {
		var idx = ((this.turn - 1) % this.usernames.length);
		return this.usernames[idx];
	}
	getUserColor(username) {
		let userIdx = _.findIndex(this.usernames, (u) => (u === username));
		return COLOR.HEX[COLOR.ORDER[userIdx]];
	}
}

module.exports = ClientGame;