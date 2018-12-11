const _ = require('lodash'); // TODO don't bundle lodash on client side
const COLOR = require('./color');

class ClientGame {
	constructor() {}
	static compileToJson(gameRoom, canViewFaker, canViewKeyword, pickFields) {
		let res = {
			roomCode: gameRoom.roomCode,
			host: gameRoom.host.name,
			usernames: _.map(gameRoom.users, (u) => (u.name)),
			state: gameRoom.state,
			turn: gameRoom.turn,
			keyword: canViewKeyword ? gameRoom.keyword : '???',
			hint: gameRoom.hint,
			faker: canViewFaker ? gameRoom.faker.name : undefined,
			strokes: gameRoom.strokes,
		};
		res = _.pick(res, pickFields);
		return res;
	}
	static compileSetup(gameRoom) {
		let json = ClientGame.compileToJson(gameRoom, false, false, ['roomCode', 'usernames', 'host', 'state', 'turn']);
		return new ClientGame().overwriteFromJson(json);
	}
	static compileStrokes(gameRoom) {
		let json = ClientGame.compileToJson(gameRoom, false, false, ['state', 'turn', 'strokes']);
		return new ClientGame().overwriteFromJson(json);
	}
	static compileRoundStart(gameRoom, fakerView) {
		let json = ClientGame.compileToJson(gameRoom, fakerView, !fakerView, ['usernames', 'state', 'turn', 'keyword', 'hint', 'faker', 'strokes']);
		return new ClientGame().overwriteFromJson(json);
	}
	static fromJson(json) {
		let game = new ClientGame();
		Object.assign(game, json);
		return game;
	}
	overwriteFromJson(json) {
		Object.assign(this, json);
		return this;
	}
	whoseTurn() {
		let idx = ((this.turn - 1) % this.usernames.length);
		return this.usernames[idx];
	}
	getUserColor(username) {
		let userIdx = _.findIndex(this.usernames, (u) => (u === username));
		return COLOR.HEX[COLOR.ORDER[userIdx]];
	}
}

module.exports = ClientGame;