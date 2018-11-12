const _ = require('lodash');

const GAME_STATE = {
	'INVITE': 'INVITE',
	'PLAY': 'PLAY',
	'GAME_OVER': 'GAME_OVER',
	'CLOSED': 'CLOSED'
};

class Player {
	constructor(name, isHost = false, color) {
		this.name = name;
		this.isHost = isHost;
		this.color = color;
		this.isFaker = false; // TODO remove client-side visibility
	}
	setFaker(isFaker) {
		this.isFaker = isFaker;
	}
}

class GameRoom {
	constructor() {
		this.state = GAME_STATE.INVITE;
		this.players = [];
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
	resetGame() {
		this.state = GAME_STATE.INVITE;
	}
	newRound() {
		this.state = GAME_STATE.PLAY;
	}
	closeGame() {
		this.state = GAME_STATE.CLOSED;
	}
}
