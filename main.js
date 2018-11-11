const express = require('express');
const http = require('http');

const app = express();
const httpServer = new http.Server(app);
const port = process.env.PORT || 3000;

app.use(express.static('./public'));
httpServer.listen(port, function() {
	console.log(`httpServer listening on port ${port}`);
});