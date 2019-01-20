const GameRoom = require('./game-room').GameRoom;
const Util = require('../common/util');
const GameError = require('./game-error');

const rooms = new Map();
const ROOMS_LIMIT = 100;

const Prompts = require('./prompts');

function getRoomByCode(roomCode) {
	return rooms.get(roomCode);
}

function teardownRoom(room) {
	rooms.delete(room.roomCode);
	console.log(`Teardown for room ${room.roomCode}. Room count: ${rooms.size}`);
}

function generateCode() {
	const firstWord = Prompts.getRandomPrompt();
	const secondWord = Prompts.getRandomPrompt();
	const code = firstWord.keyword + '-' + secondWord.keyword;

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
	let code = generateNewRoomCode();
	let rm = new GameRoom(code);
	rooms.set(code, rm);
	console.log(`Created room ${rm.roomCode}. Room count: ${rooms.size}`);
	return rm;
}

module.exports = {
	createRoom, getRoomByCode, teardownRoom, isFull
};