const gameJs = require('../../common/game');
const GameRoom = gameJs.GameRoom;
const MESSAGE = require('../../common/message').MESSAGE;

export const socket = io();
var room = undefined;

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