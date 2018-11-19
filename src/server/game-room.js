
const ClientGame = require('../common/client-game');
const Stroke = require('../common/game-canvas').Stroke;
const GAME_STATE = require('../common/game-state');
const Util = require('../common/util');

const MAX_USERS = 10;

class GameRoom {
	constructor(roomCode, host) {
		this.roomCode = roomCode;
		this.users = [];
		this.host = host;

		this.state = GAME_STATE.INVITE;

		this.turn = -1;
		this.keyword = undefined;
		this.hint = undefined;
		this.faker = undefined;

		this.strokes = [];
	}
	addUser(user, isHost = false) {
		if(this.users.length >= MAX_USERS) {
			return false;
		}
		this.users.push(user);
		if(isHost) {
			this.host = user;
		}
		return true;
	}
	dropUser(user) {
		let idx = this.users.indexOf(user);
		this.users.splice(idx, 1);
		return this.users.length;
	}
	findUser(name) {
		// TODO account for / validate against duplicate names 
		return this.users.find((p) => (p.name === name));
	}
	findHost() {
		return this.users.find((p) => (p.isHost === true));
	}
	startNewRound() {
		this.state = GAME_STATE.PLAY;
		this.turn = 1;
		this.keyword = 'Keyword here';
		this.hint = 'Hint here';
		this.shuffleUsers();
		this.faker = Util.randomItemFrom(this.users);
	}
	whoseTurn() {
		var idx = (this.turn % this.users.length) - 1;
		return this.users[idx];
	}
	shuffleUsers() {
		Util.shuffle(this.users);
	}
	closeGame() {
		this.state = GAME_STATE.CLOSED;
	}
	compileGameState(canViewFaker) {
		return ClientGame.compile(this, canViewFaker);
	}
	gameHasStarted() {
		return this.turn >= 1;
	}
	addStroke(username, points) {
		this.strokes.push(new Stroke(username, points));
		return this.strokes;
	}
	nextTurn() {
		if(this.gameHasStarted()) {
			this.turn++;
			return this.turn;
		}
		return undefined;
	}
}

module.exports = {
	GameRoom,
};