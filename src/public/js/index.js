const net = require('./net');
const menu = require('./menu');
const gameCanvas = require('../../common/game-canvas');
const paint = require('./paint');

window.FAO = {
	username: undefined,
	game: undefined,
	myTurn() {
		return FAO.game.whoseTurn() === FAO.username;
	}
};