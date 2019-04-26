const GameRoom = require('./game-room').GameRoom;
const Util = require('../common/util');
const GameError = require('./game-error');

const rooms = new Map();
const ROOMS_LIMIT = 100;
const ROOM_CODE_LENGTH = 5;

function getRoomByCode(roomCode) {
	return rooms.get(roomCode);
}

const delayUntilTeardown = 1000 * 60;
function triggerDelayedRoomTeardown(room) {
	setTimeout(function() {
		// ensure room really is dead and hasn't already been torn down
		if(getRoomByCode(room.roomCode) && room.isDead()) {
			teardownRoom(room);
		} else {
			console.log(`Cancel teardown for room-${room.roomCode}`);
		}
	}, delayUntilTeardown);
}
function teardownRoom(room) {
	rooms.delete(room.roomCode);
	console.log(`Teardown for room ${room.roomCode}. Room count: ${rooms.size}`);
}

function generateRoomCode() {
	let code = '';
	for(let i=0; i<ROOM_CODE_LENGTH; i++) {
		code += ''+Util.randomInt(10);
	}
	return code;
}
function generateUniqueRoomCode() {
	if(rooms.size >= ROOMS_LIMIT) {
		return undefined;
	}
	let code;
	do {
		code = generateRoomCode();
	} while(rooms.has(code));
	return code;
}
function isFull() {
	if(rooms.size >= ROOMS_LIMIT) {
		return true;
	}
	return false;
}
function createRoom(hostUser) {
	if(isFull()) {
		return undefined;
	}
	let code = generateUniqueRoomCode();
	let rm = new GameRoom(code);
	rooms.set(code, rm);
	console.log(`Created room ${rm.roomCode}. Room count: ${rooms.size}`);
	return rm;
}

module.exports = {
	createRoom, getRoomByCode, triggerDelayedRoomTeardown, teardownRoom, isFull
};