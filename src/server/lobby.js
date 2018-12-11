const GameRoom = require('./game-room').GameRoom;
const Util = require('../common/util');

const rooms = new Map();
const ROOMS_LIMIT = 100;

function getRoomByCode(roomCode) {
	return rooms.get(roomCode);
}

function teardownRoom(room) {
	rooms.delete(room.roomCode);
	console.log(`Teardown for room ${room.roomCode}. Room count: ${rooms.size}`);
}

function generateCode() {
	const codeLength = 5;
	let code = '';
	for(let i=0; i<codeLength; i++) {
		code += ''+Util.randomInt(10);
	}
	return code;
}
function generateNewRoomCode() {
	if(rooms.size >= ROOMS_LIMIT) {
		return undefined;
	}
	let code;
	do {
		code = generateCode();
	} while(rooms.has(code));
	return code;
}
function createRoom(hostUser) {
	if(rooms.size >= ROOMS_LIMIT) {
		console.warn(`Did not create room - room limit reached.`);
		return undefined;
	}
    
	let code = generateNewRoomCode();
	let rm = new GameRoom(code);
	rooms.set(code, rm);
	console.log(`Created room ${rm.roomCode}. Room count: ${rooms.size}`);
	return rm;
}

module.exports = {
	createRoom, getRoomByCode, teardownRoom
};