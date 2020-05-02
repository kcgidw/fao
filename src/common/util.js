function randomInt(max) {
	// max-exclusive
	return Math.floor(Math.random() * max);
}
function randomItemFrom(arr) {
	let idx = randomInt(arr.length);
	return arr[idx];
}

// thanks StackOverflow
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function validateUsername(name) {
	name = name.trim();
	const minChars = 1;
	const maxChars = 15;
	const regex = new RegExp(`^[0-9a-zA-Z ]{${minChars},${maxChars}}$`);
	return name.match(regex);
}

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function negligible(a, b, thresh = 0.0001) {
	return Math.abs(a - b) < thresh;
}

export { randomInt, randomItemFrom, shuffle, validateUsername, capitalize, negligible };
