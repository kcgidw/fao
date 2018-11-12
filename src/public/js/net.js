const gameJs = require('../../common/game');
const GameRoom = gameJs.GameRoom;

export const socket = io();
var room = undefined;

const MESSAGE = {
	'JOIN': 'JOIN',
	'USER_JOINED': 'USER_JOINED',
	'USER_LEFT': 'USER_LEFT',
	'NEW_TURN': 'NEW_TURN',
}

socket.on(MESSAGE.JOIN, function(msg) {
	room = GameRoom.fromJson(msg.roomState);
});
socket.on(MESSAGE.USER_JOINED, function(msg) {
	room = GameRoom.fromJson(msg.roomState);
});
socket.on(MESSAGE.USER_LEFT, function(msg) {
	room = GameRoom.fromJson(msg.roomState);
});
socket.on(MESSAGE.NEW_TURN, function(msg) {
	room = GameRoom.fromJson(msg.roomState);
});