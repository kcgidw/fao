import fs from 'fs';
import * as path from 'path';
import parse from 'csv-parse';
import { randomItemFrom } from '../../common/util.js';

const filename = path.resolve(__dirname, 'prompts.csv');

let prompts;

function loadPrompts() {
	return new Promise(function(resolve, reject) {
		fs.readFile(filename, function(err, fileData) {
			parse(fileData, { columns: true, trim: true }, function(err, output) {
				if (err) {
					throw err;
				} else {
					prompts = output;
					validatePromptHeaders(prompts);
					resolve(output);
				}
			});
		});
	});
}

function validatePromptHeaders(prompts) {
	let item = prompts[0];
	if (item.keyword && item.hint) {
		return true;
	} else {
		throw new Error('Incorrect prompt headers');
	}
}

function getRandomPrompt() {
	if (prompts === undefined) {
		console.error('No prompts found');
	}
	return randomItemFrom(prompts);
}

export { loadPrompts, getRandomPrompt };
