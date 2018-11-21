const ClientGame = require('../../common/client-game');
const GAME_STATE = require('../../common/game-state');
const MESSAGE = require('../../common/message');
const Util = require('../../common/util');

const EE = mitt();
window.EE = EE;

const socket = io();
window.socket = socket;

window.FAO = {
	username: $('input#join-username-input').val(),
	game: undefined,
	myTurn() {
		return FAO.game.whoseTurn() === FAO.username;
	},
};

const paint = require('./paint');

const VIEW = {
	'LANDING': 'div#landing',
	'WAITING': 'div#waiting-room',
	'IN_GAME': 'div#in-game',
}
const MENU = {
	'FIRST': 'div#first-prompt-menu',
	'CREATE': 'div#create-game-menu', 
	'JOIN': 'div#join-game-menu',
};

function handleSocket(messageName, handler) {
	socket.on(messageName, function(data) {
		if(data.err) {
			console.warn(data.err);
			return;
		}
		if(handler) {
			handler(data);
		}
		updateGame(messageName, data);
		EE.emit(messageName, data);
	})
}
handleSocket(MESSAGE.CREATE_GAME, function(data) {
	FAO.username = data.username;
});
handleSocket(MESSAGE.JOIN_GAME);
handleSocket(MESSAGE.USER_JOINED);
handleSocket(MESSAGE.USER_LEFT);
handleSocket(MESSAGE.START_GAME);
handleSocket(MESSAGE.NEW_TURN);

function updateGame(messageName, data) {
	if(!FAO.game) {
		FAO.game = ClientGame.fromJson(data.roomState);
	} else {
		FAO.game.overwriteFromJson(data.roomState);
	}
	updateUI();
}

function updateUI() {
	if(FAO.game === undefined) {
		setView('LANDING', 'FIRST');
		return;
	}
 	switch(FAO.game.state) {
		case GAME_STATE.INVITE:
			setView('WAITING');
			$('div#waiting-room .game-code h1').text(FAO.game.roomCode);
			let usersList = $('ul.users');
			usersList.empty();
			for(let un of FAO.game.usernames) {
				let elem = $(`<li>${un}</li>`);
				usersList.append(elem);
			}
			break;
		case GAME_STATE.PLAY:
			setView('IN_GAME');
			$('div#in-game .prompt span.hint').text(FAO.game.hint);
			$('div#in-game .prompt span.keyword').text(FAO.game.keyword);
			$('div#in-game span.whose-turn').text(FAO.game.whoseTurn());
			break;
		case GAME_STATE.ROUND_OVER:
			setView('IN_GAME');
			break;
		default:
			console.warn(`Bad game state ${FAO.game.state}`);
	}
	determineStyles();
}

function setView(viewKey, menuKey) {
	if(VIEW[viewKey] === undefined) {
		console.warn('Bad viewKey ' + viewKey);
	}
	for(let sel of Object.values(VIEW)) {
		if(VIEW[viewKey] === sel) {
			$(VIEW[viewKey]).show();
		} else {
			$(sel).hide();
		}
	}
	if(menuKey) {
		setMenu(menuKey);
	}
}
function setMenu(menuKey) {
	if(MENU[menuKey] === undefined) {
		console.warn('Bad menuKey ' + menuKey);
	}
	for(let sel of Object.values(MENU)) {
		if(MENU[menuKey] === sel) {
			$(MENU[menuKey]).show();
		} else {
			$(sel).hide();
		}
	}
}

/* ============================================================================
	Landing 
============================================================================ */

$('form').on('submit', function(e) {
	e.preventDefault();
});
$('form#create-game-form').on('submit', function(e) {
	let username = $('#create-game-form #create-username-input').val();
	let res = submitCreateGame(username);
	determineStyles();
});
$('form#join-game-form').on('submit', function(e) {
	let username = $('#join-game-form #join-username-input').val();
	let roomCode = $('#join-game-form #join-code').val();
	let res = submitJoinGame(roomCode, username);
	determineStyles();
});

let landingView = $('#landing.view');
let waitingView = $('#waiting-room.view');
let gameView = $('#in-game.view');

let gotoCreateBtn = $('#goto-create-menu.btn');
let gotoJoinBtn = $('#goto-join-menu.btn');

let createBtn = $('#create-game-btn.btn');
let createBackBtn = $('#create-game-back-btn.btn');

let joinBackBtn = $('#join-game-back-btn.btn');
let joinBtn = $('#join-game-btn.btn');

gotoCreateBtn.on('click', function(e) {
	setMenu('CREATE');
	determineStyles()
});
gotoJoinBtn.on('click', function(e) {
	setMenu('JOIN');
	determineStyles();
});
createBackBtn.on('click', function(e) {
	setMenu('FIRST');
	determineStyles();
});
joinBackBtn.on('click', function(e) {
	setMenu('FIRST');
	determineStyles();
});

let attemptingGameJoin = false;

function determineStyles() {
	let game = FAO.game;
	landingView.toggle(game === undefined);
	waitingView.toggle(game && game.state === GAME_STATE.INVITE);
	gameView.toggle(game && (game.state === GAME_STATE.PLAY || game.state === GAME_STATE.ROUND_OVER));

	createBtn.prop('disabled', !FAO.username || attemptingGameJoin);
	joinBtn.prop('disabled', !FAO.username || !$('#join-code').val() || attemptingGameJoin);
	createBackBtn.prop('disabled', attemptingGameJoin);
	joinBackBtn.prop('disabled', attemptingGameJoin);
}

// sync username field for create and join menus
$('input#create-username-input').on('input', function(e) {
	FAO.username = this.value;
	$('input#join-username-input').val(FAO.username);
	determineStyles();
});
$('input#join-username-input').on('input', function(e) {
	FAO.username = this.value;
	$('input#create-username-input').val(FAO.username);
	determineStyles();
});
$('input#join-code').on('input', function(e) {
	determineStyles();
});

/* ============================================================================
	Waiting room 
============================================================================ */

$('#waiting-room .actions .leave').on('click', function(e) {
	submitLeaveGame();
	determineStyles();
});
$('#waiting-room .actions .start').on('click', function(e) {
	submitStartGame();
	determineStyles();
});

function submitCreateGame(username) {
	if(Util.validateUsername(username)) {
		window.socket.emit(MESSAGE.CREATE_GAME, {
			username: username,
		});
		return true;
	}
	return false;
}
function submitJoinGame(roomCode, username) {
	if(Util.validateUsername(username)) {
		window.socket.emit(MESSAGE.JOIN_GAME, {
			roomCode: roomCode,
			username: username,
		});
		return true;
	}
	return false;
}
function submitLeaveGame() {
	setView('LANDING', 'FIRST');
	FAO.game = undefined;
	window.EE.emit('leave game');
	window.socket.emit(MESSAGE.LEAVE_GAME, {});
}
function submitStartGame() {
	window.EE.emit('submit start game');
	window.socket.emit(MESSAGE.START_GAME, {});
}

setView('LANDING', 'FIRST');

module.exports = {
	VIEW, MENU, setView, setMenu,
};