const COLOR = require('./color');

function generateClientGame() {
	return {
		roomCode: undefined,
		users: [],
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
			Object.assign(this, json);
		},
		getUserColor(username) {
			let userIdx = _.findIndex(this.getUsernames(), (u) => (u === username));
			return COLOR.HEX[COLOR.ORDER[userIdx]] || 'var(--grey6)';
		},
	};
}

module.exports = { generateClientGame };