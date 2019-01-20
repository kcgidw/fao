const MESSAGE = require('../../common/message');
const socket = io();
const VIEW = require('./view');
const ClientGame = require('../../common/cli-game');
const Util = require('../../common/util');
const GAME_PHASE = require('../../common/game-phase');

const Store = {
	state: {
		username: '',
		view: VIEW.HOME,
		gameState: undefined,
		createWarning: undefined,
		joinWarning: undefined,
	},
	setUsername(username) {
		this.state.username = username;
	},
	setView(view) {
		this.state.view = view;
	},
	setGameState(newGameState) {
		if(newGameState === undefined) {
			this.state.gameState = undefined;
			this.setView(VIEW.HOME);
			return;
		}

		if(this.state.gameState === undefined) {
			this.state.gameState = ClientGame.generateClientGameState();
		}
		this.state.gameState.adoptJson(newGameState);

		if(this.state.gameState.phase === GAME_PHASE.SETUP) {
			this.setView(VIEW.SETUP);
		} else if(this.state.gameState.phase === GAME_PHASE.PLAY || this.state.gameState.phase === GAME_PHASE.ROUND_OVER) {
			this.setView(VIEW.GAME);
		}
	},
	myTurn() {
		return this.state.gameState
		 && this.state.gameState.whoseTurn === this.state.username
		 && this.state.gameState.phase === GAME_PHASE.PLAY;
	},
	setWarning(warningName, message) {
		this.state[warningName] = message;
	},
	submitCreateGame,
	submitJoinGame,
	submitLeaveGame,
	submitStartGame,
	submitStroke,
};

function handleSocket(messageName, handler, errHandler) {
	socket.on(messageName, function(data) {
		if(data.err) {
			console.warn(data.err);
			if(errHandler) {
				errHandler(data.err);
			}
			return;
		}
		if(handler) {
			handler(data);
		}
		if(data.roomState !== undefined) {
			Store.setGameState(data.roomState);
		}
	});
}
handleSocket(MESSAGE.CREATE_ROOM,
	function(data) {
		Store.setUsername(data.username);
	},
	function(errMsg) {
		Store.setWarning('createWarning', errMsg);
	}
);
handleSocket(MESSAGE.JOIN_ROOM,
	function(data) {
	},
	function(errMsg) {
		Store.setWarning('joinWarning', errMsg);
	}
);
handleSocket(MESSAGE.USER_JOINED);
handleSocket(MESSAGE.LEAVE_ROOM, function(data) {
	Store.setGameState(undefined);
});
handleSocket(MESSAGE.USER_LEFT);
handleSocket(MESSAGE.START_GAME);
handleSocket(MESSAGE.NEW_TURN);

const usernameWarning = 'Username must be 1-20 characters long, and can only contain alphanumerics and spaces';
function submitCreateGame(username) {
	username = username.trim();
	if(Util.validateUsername(username)) {
		this.setWarning('createWarning', undefined);
		socket.emit(MESSAGE.CREATE_ROOM, {
			username: username,
		});
		return true;
	} else {
		this.setWarning('createWarning', usernameWarning);
		return false;
	}
}
function submitJoinGame(roomCode, username) {
	username = username.trim();
	if(Util.validateUsername(username)) {
		this.setWarning('joinWarning', undefined);
		socket.emit(MESSAGE.JOIN_ROOM, {
			roomCode: roomCode,
			username: username,
		});
		return true;
	} else {
		this.setWarning('joinWarning', usernameWarning);
		return false;
	}
}
function submitLeaveGame() {
	socket.emit(MESSAGE.LEAVE_ROOM, {});
}
function submitStartGame() {
	socket.emit(MESSAGE.START_GAME, {});
}
function submitStroke(points) {
	socket.emit(MESSAGE.SUBMIT_STROKE, {
		points: points,
	});
}


module.exports = Store;