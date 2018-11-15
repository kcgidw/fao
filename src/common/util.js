
function randomInt(max) { // max-exclusive
	return Math.floor(Math.random() * max);
}
function randomItemFrom(arr) {
	let idx = randomInt(arr.length);
	return arr[idx];
}

function shuffle(arr) {
	arr.sort(function() {
		return 0.5 - Math.random();
	});
}

function validateUsername(name) { //TODO
	return true;
}

module.exports = {
	randomInt,
	randomItemFrom,
	shuffle,
	validateUsername,
};