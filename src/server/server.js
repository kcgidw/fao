import * as path from 'path';
import http from 'http';
import express from 'express';
import SocketIO from 'socket.io';
import compress from 'compression';
import handleSockets from './socket-handler.js';
import { loadPrompts } from './prompts/prompts-api.js';

const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 3000;

const io = SocketIO(httpServer);

async function startServer() {
	const lobby = handleSockets(io); // socket.io app logic

	app.use(compress()); // gzip responses

	app.use(express.static(path.resolve(__dirname, '..', 'public')));

	const prompts = await loadPrompts();

	console.log(`Prompts loaded. Counted ${prompts.length} prompts`);

	httpServer.listen(port, function() {
		console.log(`httpServer listening on port ${port}`);
	});

	return lobby;
}

export default startServer();
