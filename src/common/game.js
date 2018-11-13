const _ = require('lodash');

const GAME_STATE = {
	'INVITE': 'INVITE',
	'PLAY': 'PLAY',
	'GAME_OVER': 'GAME_OVER',
	'CLOSED': 'CLOSED'
};

class GameRoom {
	constructor() {
		this.state = GAME_STATE.INVITE;
		this.players = [];
		this.turn = -1;
		this.keyword = undefined;
		this.hint = undefined;
	}
	static fromJson(json) {
		var room = new GameRoom();
		Object.assign(room, json);
		return room;
	}
	addPlayer(player) {
		this.players.push(player);
	}
	dropPlayer(player) {

	}
	findPlayer(name) {
		// TODO account for / validate against duplicate names 
		return this.players.find((p) => (p.name === name));
	}
	findHost() {
		return this.players.find((p) => (p.isHost === true));
	}
	newRound() {
		this.state = GAME_STATE.PLAY;
		this.turn = 1;
		this.keyword = 'Keyword here';
		this.hint = 'Hint here';
	}
	whoseTurn() {
		var idx = (this.turn % this.players.length) - 1;
		return this.players[idx];
	}
	closeGame() {
		this.state = GAME_STATE.CLOSED;
	}
}

export { GAME_STATE, GameRoom };