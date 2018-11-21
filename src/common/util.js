
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
	name = name.trim();
	let regex = /^[1-9a-zA-z ]{1,10}$/g; // 1-10 alphanumerics or spaces
	return name.match(regex);
}

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
	randomInt,
	randomItemFrom,
	shuffle,
	validateUsername,
	capitalize,
};