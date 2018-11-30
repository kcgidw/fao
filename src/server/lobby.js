const MESSAGE = require('../common/message');
const GameRoom = require('./game-room').GameRoom;
const User = require('../common/user');
const Util = require('../common/util');
const ClientGame = require('../common/client-game');

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
			let user = sock.user;
			if(user && user.gameRoom) {
				let rm = user.gameRoom;
				evictUser(sock.user);
				sock.user = undefined; // forget player session
				io.in(rm.roomCode).emit(MESSAGE.CREATE_GAME, {
					username: user.name,
					roomState: rm.compileGameState(false),
				});
			}
		});

		sock.on(MESSAGE.CREATE_GAME, function(data) {
			let user = sock.user || createUser(sock, data.username);
			if(user.gameRoom !== undefined) {
				sock.emit(MESSAGE.CREATE_GAME, {
					err: 'User already connected to a room'
				});
				return;
			}

			let rm = createRoom(user);

			io.in(rm.roomCode).emit(MESSAGE.CREATE_GAME, {
				username: user.name,
				roomState: rm.compileGameState(false),
			});
		});
		
		sock.on(MESSAGE.JOIN_GAME, function(data) {
			let user = sock.user || createUser(sock, data.username);
			if(user.gameRoom !== undefined) {
				sock.emit(MESSAGE.CREATE_GAME, {
					err: 'User already connected to a room',
				});
				return;
			}

			let rm = joinRoom(user, data.roomCode, false);

			if(rm && !rm.gameHasStarted()) {
				let state = rm.compileGameState(false);
				sock.emit(MESSAGE.JOIN_GAME, {
					username: user.name,
					roomState: state,
				});
				sock.to(data.roomCode).emit(MESSAGE.USER_JOINED, {
					username: user.name,
					roomState: state,
				});
			} else {
				sock.emit(MESSAGE.JOIN_GAME, {
					err: 'Room unavailable', // DNE, full, or already in play
				});
			}
		});

		sock.on(MESSAGE.START_GAME, function(data) {
			if(sock.user && sock.user.gameRoom) {
				let rm = sock.user.gameRoom;
				rm.startNewRound();
				sendRoomState(rm, MESSAGE.START_GAME);
			}
		});

		sock.on(MESSAGE.SUBMIT_STROKE, function(data) {
			if(sock.user && sock.user.gameRoom) {
				let rm = sock.user.gameRoom;
				if(rm.gameHasStarted() && rm.whoseTurn().name === sock.user.name) {
					rm.addStroke(sock.user.name, data.points);
					rm.nextTurn();
					sendRoomState(rm, MESSAGE.NEW_TURN);
				}
			}
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

var rooms = new Map();
const ROOMS_LIMIT = 100;

function createUser(socket, name) {
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