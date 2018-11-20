const _ = require('lodash');
const COLOR = require('./color');

class ClientGame {
	constructor() {}
	static compile(gameRoom, fakerView) {
		let game = new ClientGame();
		game.roomCode = gameRoom.roomCode;
		game.usernames = _.map(gameRoom.users, (u) => (u.name));
		game.host = gameRoom.host.name;
		game.state = gameRoom.state;
		game.turn = gameRoom.turn;
		game.keyword = fakerView ? '???' : gameRoom.keyword;
		game.hint = gameRoom.hint;
		game.faker = fakerView ? gameRoom.faker.name : undefined; // hide from non-fakers
		game.strokes = gameRoom.strokes;
		return game;
	}
	static compileWaitingRoom(gameRoom) {
		let game = new ClientGame();
		game.roomCode = gameRoom.roomCode;
		game.usernames = _.map(gameRoom.users, (u) => (u.name));
		game.host = gameRoom.host.name;
		game.state = gameRoom.state;
		game.turn = gameRoom.turn;
		// game.keyword = fakerView ? '???' : gameRoom.keyword;
		// game.hint = gameRoom.hint;
		// game.faker = fakerView ? gameRoom.faker.name : undefined; // hide from non-fakers
		// game.strokes = gameRoom.strokes;
		return game;
	}
	static compileStrokes(gameRoom) {
		let game = new ClientGame();
		// game.roomCode = gameRoom.roomCode;
		// game.usernames = _.map(gameRoom.users, (u) => (u.name));
		// game.host = gameRoom.host.name;
		game.state = gameRoom.state;
		game.turn = gameRoom.turn;
		// game.keyword = fakerView ? '???' : gameRoom.keyword;
		// game.hint = gameRoom.hint;
		// game.faker = fakerView ? gameRoom.faker.name : undefined; // hide from non-fakers
		game.strokes = gameRoom.strokes;
		return game;
	}
	static compileRoundStart(gameRoom, fakerView) {
		let game = new ClientGame();
		// game.roomCode = gameRoom.roomCode;
		game.usernames = _.map(gameRoom.users, (u) => (u.name)); // include for turn order
		// game.host = gameRoom.host.name;
		game.state = gameRoom.state;
		game.turn = gameRoom.turn;
		game.keyword = fakerView ? '???' : gameRoom.keyword;
		game.hint = gameRoom.hint;
		game.faker = fakerView ? gameRoom.faker.name : undefined; // hide from non-fakers
		game.strokes = gameRoom.strokes;
		return game;
	}
	static fromJson(json) {
		let game = new ClientGame();
		Object.assign(game, json);
		return game;
	}
	overwriteFromJson(json) {
		Object.assign(this, json);
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