
const ClientGame = require('../common/client-game');
const Stroke = require('../common/game-canvas').Stroke;
const GAME_STATE = require('../common/game-state');
const Util = require('../common/util');
const Prompts = require('./prompts');

const MAX_USERS = 10;

class GameRoom {
	constructor(roomCode, host) {
		this.roomCode = roomCode;
		this.users = [];
		this.host = host;

		this.state = GAME_STATE.SETUP;

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

	startNewRound() {
		this.shuffleUsers();
		this.state = GAME_STATE.PLAY;
		this.turn = 1;
		let prompt = Prompts.getRandomPrompt(); // TODO ensure no duplicate prompt
		this.keyword = Util.capitalize(prompt.keyword);
		this.hint = Util.capitalize(prompt.hint);
		this.faker = Util.randomItemFrom(this.users);
		this.strokes = [];
	}
	whoseTurn() {
		let idx = ((this.turn - 1) % this.users.length);
		return this.users[idx];
	}
	shuffleUsers() {
		Util.shuffle(this.users);
	}
	compileGameState(fakerView) {
		switch(this.state) {
			case(GAME_STATE.SETUP):
				return ClientGame.compileSetup(this);
			case(GAME_STATE.PLAY):
				if(this.turn === 1) {
					return ClientGame.compileRoundStart(this, fakerView);
				} else {
					return ClientGame.compileStrokes(this);
				}
			case(GAME_STATE.ROUND_OVER):
				return ClientGame.compileStrokes(this);
			case(GAME_STATE.CLOSED):
				return ClientGame.compileStrokes(this);
			default:
				console.error(`bad gamestate ${this.state}`);
				return ClientGame.compileToJson(this, fakerView);
		}
	}
	addStroke(username, points) {
		this.strokes.push(new Stroke(username, points));
		return this.strokes;
	}
	nextTurn() {
		if(this.gameInProcess()) {
			this.turn++;
			if(this.turn - 1 >= this.users.length * 2) {
				this.state = GAME_STATE.ROUND_OVER;
			}
			return this.turn;
		}
		return undefined;
	}
	gameInProcess() {
		return this.state === GAME_STATE.PLAY;
	}
	isFull() {
		return this.users.length >= MAX_USERS;
	}
}

module.exports = {
	GameRoom,
};