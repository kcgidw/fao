const path = require('path');
const fs = require('fs');
const parse = require('csv-parse');
const Util = require('../common/util');

var prompts;

const filename = path.resolve(__dirname, 'prompts.csv');
//TODO synchronous
fs.readFile(filename, function(err, fileData) {
	parse(fileData, {columns: true, trim: true}, function(err, output) {
		// console.log(output);
		prompts = output;
	});
});

function getPrompts() {
	return prompts;
}
function getRandomPrompt() {
	if(prompts === undefined) {
		return undefined;
	}
	return Util.randomItemFrom(prompts);
}

module.exports = {
	getPrompts, getRandomPrompt
};