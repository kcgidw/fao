const path = require('path');
const fs = require('fs');
const parse = require('csv-parse');
const Util = require('../common/util');

const filename = path.resolve(__dirname, 'prompts.csv');
//TODO synchronous

var prompts;
var getPrompts = new Promise(function(resolve, reject) {
	fs.readFile(filename, function(err, fileData) {
		parse(fileData, {columns: true, trim: true}, function(err, output) {
			if(err) {
				throw err;
				// reject(err);
			} else {
				prompts = output;
				resolve(output);
			}
		});
	});
});

function getRandomPrompt() {
	if(prompts === undefined) {
		return undefined;
	}
	return Util.randomItemFrom(prompts);
}

module.exports = {
	getPrompts, getRandomPrompt
};