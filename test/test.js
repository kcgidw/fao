// const assert = require('assert');
const chai = require('chai');
const assert = chai.assert;
const io = require('socket.io-client');
const Message = require('../src/common/message');

describe('Test Suite', function() {
	var socket;

	beforeEach(function(done) {
		require('../src/server/main')
			.then(function() {
				socket = io.connect('http://localhost:3000');
				socket.on('connect', function() {
					console.log('connected');
					done();
				});
				socket.on('disconnect', function() {
					console.log('disconnected');
				});
			})
			.catch(function(e) {
				console.error(e);
			});
	});

	afterEach(function(done) {
		if(socket.connected) {
			socket.disconnect();
			console.log('force disconnect');
		}
		done();
	});
    
	describe('CREATE_ROOM', function() {
		it('accept valid login', function(done) {
			socket.emit(Message.CREATE_ROOM, {
				username: 'playerA',
			});
			socket.once(Message.CREATE_ROOM, function(data) {
				assert.notExists(data.err);
				done();
			});
		});
		it('reject missing username', function(done) {
			socket.emit(Message.CREATE_ROOM, {});
			socket.once(Message.CREATE_ROOM, function(data) {
				assert.exists(data.err);
				done();
			});
		});
		it('reject empty username', function(done) {
			socket.emit(Message.CREATE_ROOM, {
				username: '',
			});
			socket.once(Message.CREATE_ROOM, function(data) {
				assert.exists(data.err);
				done();
			});
		});
		it('reject long username', function(done) {
			socket.emit(Message.CREATE_ROOM, {
				username: '12345678901234567890',
			});
			socket.once(Message.CREATE_ROOM, function(data) {
				assert.exists(data.err);
				done();
			});
		});
		it('reject user already in a room', function(done) {
			socket.emit(Message.CREATE_ROOM, {
				username: 'playerB',
			});
			socket.once(Message.CREATE_ROOM, function(data) {
				assert.notExists(data.err);
				socket.emit(Message.CREATE_ROOM, {
					username: 'playerBB',
				});
				socket.once(Message.CREATE_ROOM, function(data) {
					assert.exists(data.err);
					done();
				});
			});
		});
	});
});