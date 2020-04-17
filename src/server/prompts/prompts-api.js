import fs from 'fs';
import * as path from 'path';
import parse from 'csv-parse';
import { randomItemFrom } from '../../common/util.js';
let prompts = {};

async function loadPrompts() {
	const dirCont = fs.readdirSync(path.resolve(__dirname));
	const files = dirCont.filter((elm) => /.*\.(csv)/gi.test(elm));
	let promises = [];
	files.forEach((filename) => {
		promises.push(
			new Promise(function(resolve, reject) {
				files.forEach((filename) => {
					let language = filename.split('-')[1].split('.')[0];
					fs.readFile(path.resolve(__dirname, filename), function(err, fileData) {
						parse(fileData, { columns: true, trim: true }, function(err, output) {
							if (err) {
								throw err;
							} else {
								prompts[language] = output;
								validatePromptHeaders(prompts, language);
								resolve(output);
							}
						});
					});
				});
			})
		);
	});
	return Promise.all(promises);
}

function validatePromptHeaders(prompts, language) {
	let item = prompts[language][0];
	if (item.keyword && item.hint) {
		return true;
	} else {
		throw new Error('Incorrect prompt headers');
	}
}

function getRandomPrompt(language) {
	if (prompts[language] === undefined) {
		console.error('No prompts found');
	}
	return randomItemFrom(prompts[language]);
}

export { loadPrompts, getRandomPrompt };
