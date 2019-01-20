
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

function validateUsername(name) {
	name = name.trim();
	const minChars = 1;
	const maxChars = 20;
	let regex = new RegExp(`^[0-9a-zA-Z ]{${minChars},${maxChars}}$`);
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