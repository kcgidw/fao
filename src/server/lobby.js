import { GameRoom } from './game-room.js';
import { randomInt } from '../common/util.js';
import debugLog from './debug-log.js';

const rooms = new Map();
const ROOMS_LIMIT = 100;
const ROOM_CODE_LENGTH = 5;
const TEARDOWN_DELAY_MS = 1000 * 60;

function getRoomByCode(roomCode) {
	return rooms.get(roomCode);
}

function triggerDelayedRoomTeardown(room) {
	setTimeout(function() {
		// ensure room really is dead and hasn't already been torn down
		if(getRoomByCode(room.roomCode) && room.isDead()) {
			teardownRoom(room);
		} else {
			debugLog(`Cancel teardown for room-${room.roomCode}`);
		}
	}, TEARDOWN_DELAY_MS);
}
function teardownRoom(room) {
	rooms.delete(room.roomCode);
	console.log(`Rm${room.roomCode} teardown. Last round: ${room.round}. Room count: ${rooms.size}`);
}

function generateRoomCode() {
	let code = '';
	for(let i=0; i<ROOM_CODE_LENGTH; i++) {
		code += ''+randomInt(10);
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
function createRoom() {
	if(isFull()) {
		return undefined;
	}
	let code = generateUniqueRoomCode();
	let rm = new GameRoom(code);
	rooms.set(code, rm);
	console.log(`Rm${rm.roomCode} created. Room count: ${rooms.size}`);
	return rm;
}

export {
	createRoom, getRoomByCode, triggerDelayedRoomTeardown, teardownRoom, isFull,
};