const MESSAGE = require('../common/message');
const Ajv = require('ajv');
const ajv = new Ajv();

const SCHEMA = {};
SCHEMA[MESSAGE.CREATE_ROOM] = {
	$id: MESSAGE.CREATE_ROOM,
	properties: {
		username: {
			type: 'string',
			minLength: 1,
			maxLength: 10,
		},
	},
	required: ['username'],
};
SCHEMA[MESSAGE.JOIN_ROOM] = {
	$id: MESSAGE.JOIN_ROOM,
	properties: {
		username: {
			type: 'string',
			minLength: 1,
			maxLength: 10,
		},
		roomCode: {
			type: 'string',
			minLength: 1,
		},
	},
	required: ['username', 'roomCode'],
};
SCHEMA[MESSAGE.LEAVE_ROOM] = {
	$id: MESSAGE.LEAVE_ROOM,
	properties: {
	},
	required: [],
};
SCHEMA[MESSAGE.START_GAME] = {
	$id: MESSAGE.START_GAME,
	properties: {
	},
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
		},
	},
	required: ['points'],
};

for(let schema of Object.values(SCHEMA)) {
	ajv.addSchema(schema, schema.$id);
}
console.log(`Message schemas loaded.`);
// console.log(SCHEMA);

function validateMessageFromClient(messageName, json) {
	let res = ajv.validate(messageName, json);
	if(!res) {
		console.warn('Invalid message received from client:');
		console.warn(ajv.errorsText());
	}
	return res;
}

module.exports = {
	validateMessageFromClient
};