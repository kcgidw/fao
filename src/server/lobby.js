const MESSAGE = require('../common/message');
const GameRoom = require('./game-room').GameRoom;
const User = require('../common/user');
const Util = require('../common/util');
const ClientGame = require('../common/client-game');
const Schema = require('./schema');

function handleSocketIO(io) {
	io.on('connection', function(sock) {
		console.log(`Connection: sockId = ${sock.id}`);

		sock.on('disconnect', function() {
			console.log(`Disconnect: sockId = ${sock.id}, name = ${sock.user && sock.user.name}`);
			let user = sock.user;
			if(user && user.gameRoom) {
				let rm = user.gameRoom;
				evictUser(user);
				sendRoomState(rm, MESSAGE.USER_LEFT, (r) => {
					r.username = user.name;
					return r;
				})
				io.in(rm.roomCode).emit(MESSAGE.USER_LEFT, {
					username: user.name,
					roomState: ClientGame.compileSetup(rm),
				});
			}
		});

		sock.on(MESSAGE.LEAVE_GAME, function(data) {
			if(validateAndHandleInvalidMessage(sock, MESSAGE.LEAVE_GAME, data)) { return; }
			let user = sock.user;
			let errObj = runCheckers(
				Ensure.hasUser(sock),
				Ensure.userInRoom(sock)
			);
			if(errObj.err) {
				sock.emit(MESSAGE.LEAVE_GAME, errObj);
				return;
			}

			let rm = user.gameRoom;
			evictUser(sock.user);
			sock.user = undefined; // forget player session
			// tell other players in room that this player has left
			io.in(rm.roomCode).emit(MESSAGE.USER_LEFT, {
				username: user.name,
				roomState: rm.compileGameState(false),
			});
		});

		sock.on(MESSAGE.CREATE_GAME, function(data) {
			if(validateAndHandleInvalidMessage(sock, MESSAGE.CREATE_GAME, data)) { return; }
			let user = sock.user || initUser(sock, data.username);
			let errObj = runCheckers(
				Ensure.hasUser(sock),
				Ensure.userNotInARoom(sock)
			);
			if(errObj.err) {
				sock.emit(MESSAGE.CREATE_GAME, errObj);
				return;
			}

			let rm = createRoom(user);
			io.in(rm.roomCode).emit(MESSAGE.CREATE_GAME, {
				username: user.name,
				roomState: rm.compileGameState(false),
			});
		});
		
		sock.on(MESSAGE.JOIN_GAME, function(data) {
			if(validateAndHandleInvalidMessage(sock, MESSAGE.JOIN_GAME, data)) { return; }
			let user = sock.user || initUser(sock, data.username);
			let errObj = runCheckers(
				Ensure.hasUser(sock),
				Ensure.userNotInARoom(sock),
				Ensure.roomExists(data.roomCode),
				Ensure.roomIsNotFull(data.roomCode),
				Ensure.gameNotInProcess(data.roomCode)
			);
			if(errObj.err) {
				sock.emit(MESSAGE.JOIN_GAME, errObj);
				return;
			}

			let rm = joinRoom(user, data.roomCode, false);
			let state = rm.compileGameState(false);
			sock.emit(MESSAGE.JOIN_GAME, {
				username: user.name,
				roomState: state,
			});
			sock.to(data.roomCode).emit(MESSAGE.USER_JOINED, {
				username: user.name,
				roomState: state,
			});
		});

		sock.on(MESSAGE.START_GAME, function(data) {
			if(validateAndHandleInvalidMessage(sock, MESSAGE.START_GAME, data)) { return; }
			let errObj = runCheckers(
				Ensure.hasUser(sock),
				Ensure.userInRoom(sock),
				Ensure.userGameNotInProcess(sock)
			);
			if(errObj.err) {
				sock.emit(MESSAGE.START_GAME, errObj);
				return;
			}

			let rm = sock.user.gameRoom;
			rm.startNewRound();
			sendRoomState(rm, MESSAGE.START_GAME);
		});

		sock.on(MESSAGE.SUBMIT_STROKE, function(data) {
			if(validateAndHandleInvalidMessage(sock, MESSAGE.START_GAME, data)) { return; }
			let errObj = runCheckers(
				Ensure.hasUser(sock),
				Ensure.userInRoom(sock),
				Ensure.userGameInProcess(sock)
				// Ensure.isProperTurn(sock.user)
			);
			if(errObj.err) {
				sock.emit(MESSAGE.SUBMIT_STROKE, errObj);
				return;
			}

			let rm = sock.user.gameRoom;
			rm.addStroke(sock.user.name, data.points);
			rm.nextTurn();
			// rm.applyTurnDecision(data.points);
			sendRoomState(rm, MESSAGE.NEW_TURN);
		});
	});
}

// send roomstate update to all users, accounting for different roles (i.e., faker vs artist)
function sendRoomState(room, messageName, modifier) {
	for(let u of room.users) {
		let s = u.socket;
		let state = room.compileGameState(false);
		let fakerState = room.compileGameState(true);
		let res = {
			roomState: room.faker.name === u.name ? fakerState : state,
		};
		res = modifier ? modifier(res) : res;
		s.emit(messageName, res);
	}
}

function validateAndHandleInvalidMessage(sock, messageName, data) {
	if(!Schema.validateMessageFromClient(messageName, data)) {
		sock.emit(messageName, {
			err: 'Invalid message',
		});
		return true; // return true if triggers error
	}
	return false;
}

const Ensure = {
	// NOTE: name the internal functions for debugging
	hasUser(sock) {
		return function hasUser(errObj) {
			let res = sock.user !== undefined;
			errObj.err = res ? undefined : 'No user';
		};
	},
	userInRoom(sock) {
		return function userInRoom(errObj) {
			let res = sock.user.gameRoom !== undefined;
			errObj.err = res ? undefined : 'No room';
		}
	},
	userNotInARoom(sock) {
		return function userNotInRoom(errObj) {
			let res = sock.user.gameRoom === undefined;
			errObj.err = res ? undefined : 'Already in a room';
		}
	},
	roomExists(rmCode) {
		return function roomExists(errObj) {
			let res = rooms.get(rmCode) !== undefined;
			errObj.err = res ? undefined : 'Room unavailable';
		}
	},
	gameInProcess(rmCode) {
		return function gameNotInProcess(errObj) {
			let rm = rooms.get(rmCode);
			let res = rm.gameInProcess();
			errObj.err = res ? undefined : 'Game not in process'; // TODO don't reveal that code is valid
		}
	},
	userGameInProcess(sock) {
		return this.gameInProcess(sock.user.gameRoom.roomCode);
	},
	gameNotInProcess(rmCode) {
		return function gameNotInProcess(errObj) {
			let rm = rooms.get(rmCode);
			let res = !rm.gameInProcess();
			errObj.err = res ? undefined : 'Game in process'; // TODO don't reveal that code is valid
		}
	},
	userGameNotInProcess(sock) {
		return this.gameNotInProcess(sock.user.gameRoom.roomCode);
	},
	roomIsNotFull(rmCode) {
		return function roomExists(errObj) {
			let res = !rooms.get(rmCode).isFull();
			errObj.err = res ? undefined : 'Room unavailable';
		}
	}
}
function runCheckers(... stateValidators) {
	let errObj = {};
	for(let sv of stateValidators) {
		sv(errObj);
		if(errObj.err) {
			console.log(`Checker ${sv.name} triggered: ` + errObj.err);
			break;
		}
	}
	return errObj;
}

var rooms = new Map();
const ROOMS_LIMIT = 100;

function initUser(socket, name) {
	let user = new User(socket, name);
	socket.user = user;
	console.log(`Created user ${user.name}`);
	return user;
}

function generateCode() {
	const codeLength = 5;
	var code = '';
	for(let i=0; i<codeLength; i++) {
		code += ''+Util.randomInt(10);
	}
	return code;
}
function generateRoomCode() {
	if(rooms.size >= ROOMS_LIMIT) {
		return undefined;
	}
	var code;
	do {
		code = generateCode();
	} while(rooms.has(code));
	return code;
}
function createRoom(hostUser) {
	var code = generateRoomCode();
	var rm = new GameRoom(code);
	
	rooms.set(code, rm);

	joinRoom(hostUser, rm.roomCode, true);

	console.log(`Created room ${rm.roomCode}, host is '${rm.host.name}'. Room count: ${rooms.size}`);

	return rm;
}
function joinRoom(user, roomCode, isHost = false) {
	let rm = rooms.get(roomCode);
	if(rm === undefined) {
		return undefined;
	}

	rm.addUser(user, isHost);
	user.socket.join(roomCode);
	user.setGameRoom(rm);
	console.log(`User ${user.name} joined room-${roomCode}`);
	return rm;
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
		teardownRoom(rm);
	}
}
function teardownRoom(room) {
	rooms.delete(room.roomCode);
	console.log(`Teardown for room ${room.roomCode}. Room count: ${rooms.size}`);
}

module.exports = {handleSocketIO};