const MESSAGE = require('../common/message');
const User = require('../common/user');
const CliAdapter = require('./game-room').ClientAdapter;
const Schema = require('./schema');
const Lobby = require('./lobby');
const GAME_PHASE = require('../common/game-state');
const GameError = require('./game-error');

const MessageHandlers = {
	[MESSAGE.CREATE_ROOM](io, sock, data) {
		GamePrecond.sockDoesNotHaveUser(sock);
		let user = login(sock, data.username);

		GamePrecond.userIsNotInARoom(sock.user);
		GamePrecond.lobbyIsNotFull();
		let newRoom = Lobby.createRoom();

		joinRoom(user, newRoom.roomCode, true);

		io.in(newRoom.roomCode).emit(MESSAGE.CREATE_ROOM, {
			username: user.name,
			roomState: newRoom.compileGameState(false),
		});
	},

	[MESSAGE.JOIN_ROOM](io, sock, data) {
		GamePrecond.sockDoesNotHaveUser(sock);
		let user = login(sock, data.username);
		let roomToJoin = Lobby.getRoomByCode(data.roomCode);

		GamePrecond.userIsNotInARoom(sock.user);
		GamePrecond.roomExists(data.roomCode);
		GamePrecond.roomIsNotFull(roomToJoin);
		GamePrecond.gameNotInProcess(roomToJoin);
		let rm = joinRoom(user, data.roomCode, false);
		let state = rm.compileGameState(false);

		sock.emit(MESSAGE.JOIN_ROOM, {
			username: user.name,
			roomState: state,
		});
		sock.to(data.roomCode).emit(MESSAGE.USER_JOINED, {
			username: user.name,
			roomState: state,
		});
	},

	[MESSAGE.LEAVE_ROOM](io, sock, data) {
		GamePrecond.sockHasUser(sock);
		GamePrecond.userIsInARoom(sock.user);
		let user = sock.user;
		let rm = user.gameRoom;
		handleLeaveRoom(sock, user, rm);

		sock.emit(MESSAGE.LEAVE_ROOM, {});
		// also, tell other players in room that this player has left
		io.in(rm.roomCode).emit(MESSAGE.USER_LEFT, {
			username: user.name,
			roomState: rm.compileGameState(false),
		});
	},

	[MESSAGE.START_GAME](io, sock, data) {
		GamePrecond.sockHasUser(sock);
		GamePrecond.userIsInARoom(sock.user);
		GamePrecond.gameNotInProcess(sock.user.gameRoom);
		let rm = sock.user.gameRoom;
		rm.startNewRound();

		sendRoomState(rm, MESSAGE.START_GAME);
	},

	[MESSAGE.SUBMIT_STROKE](io, sock, data) {
		GamePrecond.sockHasUser(sock);
		GamePrecond.userIsInARoom(sock.user);
		GamePrecond.gameInProcess(sock.user.gameRoom);
		GamePrecond.isUsersTurn(sock.user);
		let rm = sock.user.gameRoom;
		rm.addStroke(sock.user.name, data.points);
		rm.nextTurn();

		sendRoomState(rm, MESSAGE.NEW_TURN);
	},

	disconnect(io, sock, data) {
		let user = sock.user;
		if(user) {
			let room = user.gameRoom;
			handleLeaveRoom(sock, user, user.gameRoom);
			io.in(room.roomCode).emit(MESSAGE.USER_LEFT, {
				username: user.name,
				roomState: CliAdapter.compileToJson(room),
			});
		}
	},
};

function login(sock, username) {
	let user = new User(sock, username);
	sock.user = user;
	console.log(`Logged in user ${user.name}`);
	return user;
}

function joinRoom(user, roomCode, isHost = false) {
	let rm = Lobby.getRoomByCode(roomCode);
	if(rm === undefined) {
		return undefined;
	}

	rm.addUser(user, isHost);
	user.socket.join(roomCode);
	user.setGameRoom(rm);
	console.log(`User ${user.name} joined room-${roomCode}`);
	return rm;
}

function handleLeaveRoom(sock, user, room) {
	// if room has no game in progress, drop the user from the room altogether
	if(room.phase !== GAME_PHASE.PLAY) {
		evictUser(user);
	} else {
	}
	sock.leave(room.roomCode);
	console.warn(`User ${user.name} left room.`);
	sock.user = undefined; // forget player session
}

function evictUser(user) {
	if(!user || !user.gameRoom) {
		return;
	}
	let rm = user.gameRoom;
	let usersLeftInRoom = rm.dropUser(user);
	console.log(`Evicted user w/ name: ${user.name}`);

	if(usersLeftInRoom === 0) {
		// delete room if room is now empty
		Lobby.teardownRoom(rm);
	}
}

function handleSockets(io) {
	io.on('connection', function(sock) {
		console.log(`Connection: sockId = ${sock.id}`);

		Object.keys(MessageHandlers).forEach((messageName) => {
			sock.on(messageName, function(data) {
				try {
					Schema.validateMessageFromClient(messageName, data);
					MessageHandlers[messageName](io, sock, data);
				} catch(e) {
					// REMEMBER, any code/mutations inside the try before the error do still execute
					if(e.name === GameError.name) {
						sock.emit(messageName, {
							err: e.message,
						});
					} else {
						throw e;
					}
				}
			});
		});
	});
}

const GamePrecond = {
	sockHasUser(sock) {
		if(sock.user === undefined) {
			throw new GameError('No user');
		}
	},
	sockDoesNotHaveUser(sock) {
		if(sock.user !== undefined) {
			throw new GameError('Must not have user');
		}
	},
	userIsInARoom(user) {
		if(user.gameRoom === undefined) {
			throw new GameError('User must be in a room');
		}
	},
	userIsNotInARoom(user) {
		if(user.gameRoom !== undefined) {
			throw new GameError('User must not be in a room');
		}
	},
	roomExists(roomCode) {
		if(Lobby.getRoomByCode(roomCode) === undefined) {
			throw new GameError('Room is unavailable');
		}
	},
	gameInProcess(room) {
		if(!room.gameInProcess()) {
			throw new GameError('Game must be in process');
		}
	},
	gameNotInProcess(room) {
		if(room.gameInProcess()) {
			throw new GameError('Game must not be in process');
		}
	},
	roomIsNotFull(room) {
		if(room.isFull()) {
			throw new GameError('Room unavailable');
		}
	},
	lobbyIsNotFull() {
		if(Lobby.isFull()) {
			throw new GameError('Lobby is at max capacity');
		}
	},
	isUsersTurn(user) {
		let room = user.gameRoom;
		if(room.whoseTurn() !== user) {
			throw new GameError("Not user's turn");
		}
	}
};

// send roomstate update to all users, accounting for different roles (i.e., faker vs artist)
function sendRoomState(room, messageName) {
	for(let u of room.users) {
		let s = u.socket;
		if(u.socket === undefined) {
			continue;
		}
		let state = room.compileGameState(false);
		let fakerState = room.compileGameState(true);
		let res = {
			roomState: room.faker && room.faker.name === u.name ? fakerState : state,
		};
		s.emit(messageName, res);
	}
}

module.exports = handleSockets;