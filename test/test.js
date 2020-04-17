import { assert } from 'chai';
import io from 'socket.io-client';
import MESSAGE from '../src/common/message';
import A from 'async';
import GAME_PHASE from '../src/common/game-phase';
import serverStart from '../src/server/server.js';

describe('Test Suite', function() {
	let sock1, sock2, sock3;

	beforeEach(function(done) {
		serverStart
			.then(function(lobby) {
				sock1 = io('http://localhost:3000');
				sock2 = io('http://localhost:3000');
				sock3 = io('http://localhost:3000');

				function connectSocketFn(s) {
					return (cb) => {
						s.on('connect', function() {
							// console.log('connected');
							cb();
						});
						s.on('disconnect', function() {
							// console.log('disconnected');
						});
					};
				}

				A.parallel(
					[connectSocketFn(sock1), connectSocketFn(sock2), connectSocketFn(sock3)],
					() => {
						done();
					}
				);
			})
			.catch(function(e) {
				console.error(e);
			});
	});

	afterEach(function(done) {
		[sock1, sock2, sock3].forEach(function(s) {
			if (s.connected) {
				s.disconnect();
				console.log('force disconnect');
			}
		});
		done();
	});

	describe('CREATE_ROOM', function() {
		it('accept valid login', function(done) {
			sock1.emit(MESSAGE.CREATE_ROOM, {
				username: 'playerA',
				language: 'en',
			});
			sock1.once(MESSAGE.CREATE_ROOM, function(data) {
				assert.notExists(data.err);
				done();
			});
		});
		it('reject missing username', function(done) {
			sock1.emit(MESSAGE.CREATE_ROOM, {});
			sock1.once(MESSAGE.CREATE_ROOM, function(data) {
				assert.exists(data.err);
				done();
			});
		});
		it('reject empty username', function(done) {
			sock1.emit(MESSAGE.CREATE_ROOM, {
				username: '',
				language: 'en',
			});
			sock1.once(MESSAGE.CREATE_ROOM, function(data) {
				assert.exists(data.err);
				done();
			});
		});

		it('reject empty language', function(done) {
			sock1.emit(MESSAGE.CREATE_ROOM, {
				username: 'test',
			});
			sock1.once(MESSAGE.CREATE_ROOM, function(data) {
				assert.exists(data.err);
				done();
			});
		});
		it('reject long username', function(done) {
			sock1.emit(MESSAGE.CREATE_ROOM, {
				username: '123456789012345678901234567890',
				language: 'en',
			});
			sock1.once(MESSAGE.CREATE_ROOM, function(data) {
				assert.exists(data.err);
				done();
			});
		});
		it('reject user already in a room', function(done) {
			sock1.emit(MESSAGE.CREATE_ROOM, {
				username: 'playerB',
				language: 'en',
			});
			sock1.once(MESSAGE.CREATE_ROOM, function(data) {
				assert.notExists(data.err);
				sock1.emit(MESSAGE.CREATE_ROOM, {
					username: 'playerBB',
					language: 'en',
				});
				sock1.once(MESSAGE.CREATE_ROOM, function(data) {
					assert.exists(data.err);
					done();
				});
			});
		});
	});

	describe('JOIN_ROOM', function() {
		it('accept valid login', function(done) {
			sock1.emit(MESSAGE.CREATE_ROOM, {
				username: 'bob',
				language: 'en',
			});
			sock1.once(MESSAGE.CREATE_ROOM, function(data) {
				let roomCode = data.roomState.roomCode;
				sock2.emit(MESSAGE.JOIN_ROOM, {
					username: 'larry',
					roomCode,
				});
				sock2.once(MESSAGE.JOIN_ROOM, function(data) {
					assert.notExists(data.err);
					done();
				});
			});
		});
		it('reject missing roomCode', function(done) {
			sock2.emit(MESSAGE.JOIN_ROOM, {
				username: 'nobody',
				roomCode: 1234, // what are the chances?
			});
			sock2.once(MESSAGE.JOIN_ROOM, function(data) {
				assert.exists(data.err);
				done();
			});
		});
		// it('reject join full room', function(done) {

		// });
		it('reject missing roomCode', function(done) {
			sock2.emit(MESSAGE.JOIN_ROOM, {
				username: 'xyz',
			});
			sock2.once(MESSAGE.JOIN_ROOM, function(data) {
				assert.exists(data.err);
				done();
			});
		});
		it('reject missing username', function(done) {
			sock2.emit(MESSAGE.JOIN_ROOM, {
				roomCode: 1234,
			});
			sock2.once(MESSAGE.JOIN_ROOM, function(data) {
				assert.exists(data.err);
				done();
			});
		});
		// not gonna bother with username validation tests right now
		it('reject duplicate username in room', function(done) {
			sock1.emit(MESSAGE.CREATE_ROOM, {
				username: 'spartacus',
				language: 'en',
			});
			sock1.once(MESSAGE.CREATE_ROOM, function(data) {
				let roomCode = data.roomState.roomCode;
				sock2.emit(MESSAGE.JOIN_ROOM, {
					username: 'spartacus',
					roomCode,
				});
				sock2.once(MESSAGE.JOIN_ROOM, function(data) {
					assert.exists(data.err);
					done();
				});
			});
		});
	});

	describe('RETURN_TO_SETUP', function() {
		it('works mid-game', function(done) {
			sock1.emit(MESSAGE.CREATE_ROOM, {
				username: 'bob',
				language: 'en',
			});
			sock1.once(MESSAGE.CREATE_ROOM, function(data) {
				let roomCode = data.roomState.roomCode;
				assert.notExists(data.err);
				sock1.emit(MESSAGE.START_GAME);
				sock1.once(MESSAGE.START_GAME, function(data) {
					sock1.emit(MESSAGE.RETURN_TO_SETUP);
					sock1.once(MESSAGE.RETURN_TO_SETUP, function(data) {
						assert.notExists(data.err);
						assert.equal(data.roomState.phase, GAME_PHASE.SETUP);
						done();
					});
				});
			});
		});
		it('works between rounds', function(done) {
			// TODO
			done();
		});
	});
});
