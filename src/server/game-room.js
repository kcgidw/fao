const Stroke = require('../common/game-canvas').Stroke;
const GAME_PHASE = require('../common/game-state');
const Util = require('../common/util');
const Prompts = require('./prompts');
const _ = require('lodash');

const MAX_USERS = 10;

class GameRoom {
	constructor(roomCode, host) {
		this.roomCode = roomCode;
		this.users = [];
		this.host = host;

		this.phase = GAME_PHASE.SETUP;

		this.turn = -1;
		this.keyword = undefined;
		this.hint = undefined;
		this.faker = undefined;

		this.strokes = [];
	}
	addUser(user, isHost = false) {
		if(this.isFull()) {
			console.warn('Full room');
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
		return this.users.find((p) => (p.name === name));
	}

	startNewRound() {
		this.shuffleUsers();
		this.phase = GAME_PHASE.PLAY;
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
	addStroke(username, points) {
		this.strokes.push(new Stroke(username, points));
		return this.strokes;
	}
	nextTurn() {
		if(this.gameInProcess()) {
			this.turn++;
			if(this.turn - 1 >= this.users.length * 2) {
				this.phase = GAME_PHASE.ROUND_OVER;
			}
			return this.turn;
		}
		return undefined;
	}
	gameInProcess() {
		return this.phase === GAME_PHASE.PLAY;
	}
	isFull() {
		return this.users.length >= MAX_USERS;
	}
	isDead() {
		// all users are disconnected
		return this.users.length === 0 || _.every(this.users, u => (!u.connected));
	}
}

const ClientAdapter = {
	generateStateJson(gameRoom, pickFields) {
		let res = {
			roomCode: gameRoom.roomCode,
			users: _.map(gameRoom.users, (u) => ({name: u.name, connected: u.connected})),
			phase: gameRoom.phase,
			turn: gameRoom.turn,
			whoseTurn: gameRoom.whoseTurn() ? gameRoom.whoseTurn().name : undefined,
			keyword: gameRoom.keyword,
			hint: gameRoom.hint,
			fakerName: gameRoom.faker ? gameRoom.faker.name : undefined,
			strokes: gameRoom.strokes,
		};
		if(pickFields) {
			res = _.pick(res, pickFields);
		}
		return res;
	},
	hideKeyword(stateJson) {
		let res = _.cloneDeep(stateJson);
		res.keyword = '???';
		return res;
	},
	hideFaker(stateJson) {
		let res = _.cloneDeep(stateJson);
		res.fakerName = undefined;
		return res;
	},
};

module.exports = {
	GameRoom, ClientAdapter,
};