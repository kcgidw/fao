/**
 * Schemas for socket.io messages
 */

import Ajv from 'ajv';
import MESSAGE from '../common/message.js';
import GameError from './game-error.js';
const ajv = new Ajv();

const usernameMinLength = 1;
const usernameMaxLength = 20;

const SCHEMA = {};

SCHEMA[MESSAGE.CREATE_ROOM] = {
	$id: MESSAGE.CREATE_ROOM,
	properties: {
		username: {
			type: 'string',
			minLength: usernameMinLength,
			maxLength: usernameMaxLength,
		},
	},
	required: ['username'],
};
SCHEMA[MESSAGE.JOIN_ROOM] = {
	$id: MESSAGE.JOIN_ROOM,
	properties: {
		username: {
			type: 'string',
			minLength: usernameMinLength,
			maxLength: usernameMaxLength,
		},
		roomCode: {
			type: ['string', 'number'],
			minLength: 1,
		},
	},
	required: ['username', 'roomCode'],
};
SCHEMA[MESSAGE.LEAVE_ROOM] = {
	$id: MESSAGE.LEAVE_ROOM,
	properties: {},
	required: [],
};
SCHEMA[MESSAGE.START_GAME] = {
	$id: MESSAGE.START_GAME,
	properties: {},
	required: [],
};
SCHEMA[MESSAGE.SUBMIT_STROKE] = {
	$id: MESSAGE.SUBMIT_STROKE,
	properties: {
		points: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					x: {
						type: 'number',
					},
					y: {
						type: 'number',
					},
				},
				required: ['x', 'y'],
			},
			minItems: 2,
		},
	},
	required: ['points'],
};

for (let schema of Object.values(SCHEMA)) {
	ajv.addSchema(schema, schema.$id);
}
console.log(`Message schemas loaded.`);

function validateMessageFromClient(messageName, json) {
	if (!SCHEMA[messageName]) {
		return true;
	}

	let res = ajv.validate(messageName, json);
	if (!res) {
		console.warn(ajv.errorsText());
		throw new GameError('Invalid message');
	}
	return res;
}

export { validateMessageFromClient };
