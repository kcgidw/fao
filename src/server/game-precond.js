import * as Lobby from './lobby.js';
import GameError from './game-error.js';

// Room/game state validators

const GamePrecond = {
	sockHasUser(sock) {
		if (sock.user === undefined) {
			throw new GameError('No user');
		}
	},
	sockDoesNotHaveUser(sock) {
		if (sock.user !== undefined) {
			throw new GameError('Must not have user');
		}
	},
	userIsInARoom(user) {
		if (user.gameRoom === undefined) {
			throw new GameError(`User ${user.name} should be in a room`, 'User must be in a room');
		}
	},
	userIsNotInARoom(user) {
		if (user.gameRoom !== undefined) {
			throw new GameError(
				'User must not be in a room. User is in room ' + user.gameRoom,
				'User must not be in a room'
			);
		}
	},
	roomExists(roomCode) {
		if (Lobby.getRoomByCode(roomCode) === undefined) {
			throw new GameError(`Rm${roomCode} DNE`, 'This room is unavailable');
		}
	},
	gameInProgress(room) {
		if (!room.isGameInProgress()) {
			throw new GameError('Game must be in progress');
		}
	},
	gameNotInProgress(room) {
		if (room.isGameInProgress()) {
			throw new GameError(`Rm${room.roomCode} A game is already in progress`);
		}
	},
	roomIsNotFull(room) {
		if (room.isFull()) {
			throw new GameError(`Rm${room.roomCode} is full`, 'This room is full', true);
		}
	},
	lobbyIsNotFull() {
		if (Lobby.isFull()) {
			throw new GameError('The lobby is at max capacity');
		}
	},
	isUsersTurn(user) {
		let room = user.gameRoom;
		if (room.whoseTurn() !== user) {
			throw new GameError("Not user's turn");
		}
	},
	nameIsNotTakenInRoom(username, room) {
		if (room.findUser(username)) {
			throw new GameError(
				`Username ${username} is taken in Rm${room.roomCode}`,
				'This username is taken in this room'
			);
		}
	},
	nameIsTakenInRoom(username, room) {
		if (room.findUser(username) === undefined) {
			throw new GameError(
				`Username ${username} DNE in Rm${room.roomCode}`,
				"This username doesn't exist in this room"
			);
		}
	},
	userIsDisconnected(username, room) {
		if (!room.findUser(username).connected) {
			throw new GameError(
				`Username ${username} connected to Rm${room.roomCode}`,
				'This username is taken in this room'
			);
		}
	},
};

export default GamePrecond;
