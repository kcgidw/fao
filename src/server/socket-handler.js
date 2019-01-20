const MESSAGE = require('../common/message');
const User = require('../common/user');
const CliAdapter = require('./game-room').ClientAdapter;
const Schema = require('./schema');
const Lobby = require('./lobby');
const GAME_PHASE = require('../common/game-phase');
const GameError = require('./game-error');

function handleSockets(io) {
	io.on('connection', function(sock) {
		if(process.env.NODE_ENV !== 'production') {
			console.log('Socket conncted: ' + sock.id);
		}
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

const MessageHandlers = {
	[MESSAGE.CREATE_ROOM](io, sock, data) {
		GamePrecond.sockDoesNotHaveUser(sock);
		GamePrecond.lobbyIsNotFull();

		let user = login(sock, data.username);
		let newRoom = Lobby.createRoom();

		joinRoom(user, newRoom, true);

		io.in(newRoom.roomCode).emit(MESSAGE.CREATE_ROOM, {
			username: user.name,
			roomState: CliAdapter.generateStateJson(newRoom),
		});
	},

	[MESSAGE.JOIN_ROOM](io, sock, data) {
		let roomToJoin = Lobby.getRoomByCode(data.roomCode);

		GamePrecond.sockDoesNotHaveUser(sock);
		GamePrecond.roomExists(data.roomCode);
		GamePrecond.roomIsNotFull(roomToJoin);

		let user;
		let state;

		if(data.rejoin) {
			GamePrecond.nameIsTakenInRoom(data.username, roomToJoin);
		} else {
			GamePrecond.gameNotInProgress(roomToJoin);
			GamePrecond.nameIsNotTakenInRoom(data.username, roomToJoin);
			user = login(sock, data.username);
			joinRoom(user, roomToJoin, false);
			state = CliAdapter.generateStateJson(roomToJoin);
		}

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
		let room = user.gameRoom;
		logout(sock);

		sock.emit(MESSAGE.LEAVE_ROOM, {});
		// also, tell other players in room that this player has left
		broadcastRoomState(room, MESSAGE.USER_LEFT, (res) => {
			res.username = user.name;
			return res;
		});
	},

	[MESSAGE.START_GAME](io, sock, data) {
		GamePrecond.sockHasUser(sock);
		GamePrecond.userIsInARoom(sock.user);
		GamePrecond.gameNotInProgress(sock.user.gameRoom);
		let rm = sock.user.gameRoom;
		rm.startNewRound();

		broadcastRoomState(rm, MESSAGE.START_GAME);
	},

	[MESSAGE.SUBMIT_STROKE](io, sock, data) {
		GamePrecond.sockHasUser(sock);
		GamePrecond.userIsInARoom(sock.user);
		GamePrecond.gameInProgress(sock.user.gameRoom);
		GamePrecond.isUsersTurn(sock.user);
		let rm = sock.user.gameRoom;
		rm.addStroke(sock.user.name, data.points);
		rm.nextTurn();

		broadcastRoomState(rm, MESSAGE.NEW_TURN);
	},

	disconnect(io, sock, data) {
		let user = sock.user;
		if(user) {
			let room = user.gameRoom;
			logout(sock);
			broadcastRoomState(room, MESSAGE.USER_LEFT, (res) => {
				res.username = user.name;
				return res;
			});
		}
	},
};

function login(sock, username) {
	username = username.trim();
	let user = new User(sock, username);
	sock.user = user;
	console.log(`Logged in user ${user.name}`);
	return user;
}
function logout(sock) {
	let user = sock.user;
	if(user) {
		sock.user = undefined;
		user.socket = undefined;

		let room = user.gameRoom;
		if(room) {
			sock.leave(room.roomCode);
			if(room.phase !== GAME_PHASE.PLAY) {
				// if room has no game in progress, drop the user from the room altogether
				room.dropUser(user);
				console.log(`Dropped user ${user.name} from room ${room.roomCode}`);
			}
			if(room.isDead()) {
				Lobby.teardownRoom(room);
			}
		}
		console.log(`Logged out user ${user.name}`);
	}
}

function joinRoom(user, room, isHost = false) {
	room.addUser(user, isHost);
	user.socket.join(room.roomCode);
	user.setGameRoom(room);
	console.log(`User ${user.name} joined room-${room.roomCode}`);
	return room;
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
			throw new GameError('Room unavailable');
		}
	},
	gameInProgress(room) {
		if(!room.gameInProgress()) {
			throw new GameError('Game must be in progress');
		}
	},
	gameNotInProgress(room) {
		if(room.gameInProgress()) {
			throw new GameError('A game is already in progress');
		}
	},
	roomIsNotFull(room) {
		if(room.isFull()) {
			throw new GameError('This room is full');
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
	},
	nameIsNotTakenInRoom(username, room) {
		if(room.findUser(username)) {
			throw new GameError("This username is taken in this room");
		}
	},
	nameIsTakenInRoom(username, room) {
		if(room.findUser(username) === undefined) {
			throw new GameError("This username doesn't exist in this room");
		}
	}
};

// send roomstate update to all users, accounting for different roles (i.e., faker vs artist)
function broadcastRoomState(room, messageName, addtlProcessFn) {
	let state = CliAdapter.generateStateJson(room);
	if(addtlProcessFn) {
		state = addtlProcessFn(state);
	}
	let artistView = CliAdapter.hideFaker(state);
	let fakerView = CliAdapter.hideKeyword(state);

	for(let u of room.users) {
		let s = u.socket;
		if(u.socket === undefined) {
			continue;
		}

		let res;
		if(room.phase === GAME_PHASE.PLAY || room.phase === GAME_PHASE.ROUND_OVER) {
			res = {
				roomState: room.faker && room.faker.name === u.name ? fakerView : artistView,
			};
		} else {
			res = {
				roomState: state,
			};
		}

		s.emit(messageName, res);
	}
}

module.exports = handleSockets;