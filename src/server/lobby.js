const SocketIO = require('socket.io');
const MESSAGE = require('../common/message').MESSAGE;

function handleSocketIO(io) {
    io.on('connection', function(sock) {
        console.log('connection: ' + sock.id);
    });
}

module.exports = {handleSocketIO}
