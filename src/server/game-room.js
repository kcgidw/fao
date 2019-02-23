const Stroke = require('../common/stroke');
const GAME_PHASE = require('../common/game-phase');
const Util = require('../common/util');
const Prompts = require('./prompts');
const _ = require('lodash');
const GameError = require('./game-error');

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
	readdUser(user) {
		let userTargetIdx = this.users.findIndex((u) => (u.name === user.name));
		if(userTargetIdx !== -1) {
			this.users[userTargetIdx] = user;
		} else {
			throw new GameError(`Could not readd user ${user.name}. Existing user target DNE.`, 'Could not rejoin');
		}
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
		console.log(`Room-${this.roomCode} new round`);
		this.shuffleUsers();
		this.phase = GAME_PHASE.PLAY;
		this.turn = 1;
		let prompt = Prompts.getRandomPrompt(); // TODO ensure no duplicate prompt
		this.keyword = prompt.keyword;
		this.hint = prompt.hint;
		this.faker = Util.randomItemFrom(this.users);
		this.strokes = [];
	}
	whoseTurn() {
		if(this.phase === GAME_PHASE.PLAY) {
			let idx = ((this.turn - 1) % this.users.length);
			return this.users[idx];
		}
		return undefined;
	}
	shuffleUsers() {
		Util.shuffle(this.users);
	}
	addStroke(username, points) {
		this.strokes.push(new Stroke(username, points));
		return this.strokes;
	}
	nextTurn() {
		if(this.gameInProgress()) {
			this.turn++;
			if(this.turn - 1 >= this.users.length * 2) {
				this.phase = GAME_PHASE.VOTE;
			}
			return this.turn;
		}
		return undefined;
	}
	gameInProgress() {
		return this.phase === GAME_PHASE.PLAY || this.phase === GAME_PHASE.VOTE;
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
			whoseTurn: gameRoom.whoseTurn() ? gameRoom.whoseTurn().name : null, // null, so the empty value still gets passed to the client
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