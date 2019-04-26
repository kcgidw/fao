const path = require('path');
const fs = require('fs');
const parse = require('csv-parse');
const Util = require('../common/util');

const filename = path.resolve(__dirname, 'prompts.csv');

let prompts;
let getPrompts = new Promise(function(resolve, reject) {
	fs.readFile(filename, function(err, fileData) {
		parse(fileData, {columns: true, trim: true}, function(err, output) {
			if(err) {
				throw err;
				// reject(err);
			} else {
				prompts = output;
				validatePromptHeaders(prompts);
				resolve(output);
			}
		});
	});
});

function validatePromptHeaders(prompts) {
	let item = prompts[0];
	if(item.keyword && item.hint) {
		return true;
	} else {
		throw new Error('Incorrect prompt headers');
	}
}

function getRandomPrompt() {
	if(prompts === undefined) {
		console.error('No prompts found');
	}
	return Util.randomItemFrom(prompts);
}

module.exports = {
	getPrompts, getRandomPrompt
};