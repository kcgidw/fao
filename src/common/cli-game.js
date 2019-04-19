const COLOR = require('./color');

function generateClientGameState() {
	return {
		roomCode: undefined,
		users: [],
		round: undefined,
		phase: undefined,
		turn: undefined,
		whoseTurn: undefined,
		keyword: undefined,
		hint: undefined,
		fakerName: undefined,
		strokes: [],

		getUsernames() {
			return _.map(this.users, (u) => (u.name));
		},
		adoptJson(json) {
			return Object.assign(this, json);
		},
		getUserColor(username) {
			let userIdx = _.findIndex(this.getUsernames(), (u) => (u === username));
			return userIdx >= 0 ? COLOR.HEX[COLOR.ORDER[userIdx]] || 'var(--beige6)' : 'var(--beige6)';
		},
		getMostRecentStroke() {
			return this.strokes[this.strokes.length - 1];
		},
		findUser(username) {
			return this.users.find(u => u.name === username);
		},
	};
}

module.exports = { generateClientGameState };