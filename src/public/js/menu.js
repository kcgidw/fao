const socket = require('./net').socket;
const MESSAGE = require('../../common/message');
const ClientGame = require('../../common/client-game');
const GAME_STATE = require('../../common/game-state');
const Util = require('../../common/util');

$('.btn#create-menu').on('click', function(e) {
	setMenu('CREATE');
});
$('.btn#join-menu').on('click', function(e) {
	setMenu('JOIN');
});
$('.btn.back').on('click', function(e) {
	setMenu('FIRST');
});

const VIEW = {
	'LANDING': 'div#landing',
	'LOADING': 'div#loading-screen',
	'WAITING': 'div#waiting-room',
	'IN_GAME': 'div#in-game',
}
const MENU = {
	'FIRST': 'div#first-prompt-menu',
	'CREATE': 'div#create-game-menu', 
	'JOIN': 'div#join-game-menu',
};

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

setView('LANDING', 'FIRST');

// sync username field for create and join menus
$('input#create-username').on('input', function(e) {
	FAO.username = this.value;
	$('input#join-username').val(FAO.username);
});
$('input#join-username').on('input', function(e) {
	FAO.username = this.value;
	$('input#create-username').val(FAO.username);
});

function submitCreateGame(username) {
	if(Util.validateUsername(username)) {
		socket.emit(MESSAGE.CREATE_GAME, {
			username: username,
		});
		return true;
	}
	return false;
}
function submitJoinGame(roomCode, username) {
	if(Util.validateUsername(username)) {
		socket.emit(MESSAGE.JOIN_GAME, {
			roomCode: roomCode,
			username: username,
		});
		return true;
	}
	return false;
}
function submitLeaveGame() {
	socket.emit(MESSAGE.LEAVE_GAME, {});
	setView('LANDING', 'FIRST');
}
function submitStartGame() {
	socket.emit(MESSAGE.START_GAME, {});
}
function disableFormInputs(containerString) {
	$(`${containerString} .btn`).prop('disabled', true);
	$(`${containerString} input`).prop('disabled', true);
}
$('form').on('submit', function(e) {
	e.preventDefault();
});
$('form#create-game-form').on('submit', function(e) {
	let username = $('#create-game-form #create-username').val();
	let res = submitCreateGame(username);
	if(res) {
		disableFormInputs(`#create-game-form`);
	}
});
$('form#join-game-form').on('submit', function(e) {
	let username = $('#join-game-form #join-username').val();
	let roomCode = $('#join-game-form #join-code').val();
	let res = submitJoinGame(roomCode, username);
	if(res) {
		disableFormInputs(`#create-game-form`);
	}
});
$('#waiting-room .actions .leave').on('click', function(e) {
	submitLeaveGame();
});
$('#waiting-room .actions .start').on('click', function(e) {
	submitStartGame();
	disableFormInputs(`#waiting-room`);
});

function updateGameUI(eventName, data) {
	FAO.game = ClientGame.fromJson(data.roomState);
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
			$('div#in-game .prompt').text(`${FAO.game.hint}: ${FAO.game.keyword}`);
			$('div#in-game .whose-turn').text(`Current turn: ${FAO.game.whoseTurn()}`);
			break;
		default:
			console.warn(`Bad game state ${FAO.game.state}`);
	}
}

socket.on(MESSAGE.CREATE_GAME, function(data) {
	if(data.err) {
		return;
	} else {
		name = data.username;
		updateGameUI(MESSAGE.CREATE_GAME, data);
	}
});
socket.on(MESSAGE.JOIN_GAME, function(data) {
	if(data.err) {
		return;
	} else {
		name = data.username;
		updateGameUI(MESSAGE.JOIN_GAME, data);
	}
});
socket.on(MESSAGE.USER_JOINED, function(data) {
	if(data.err) {
		return;
	} else {
		updateGameUI(MESSAGE.USER_JOINED, data);
	}
});
socket.on(MESSAGE.USER_LEFT, function(data) {
	if(data.err) {
		return;
	} else {
		updateGameUI(MESSAGE.USER_LEFT, data);
	}
});
socket.on(MESSAGE.START_GAME, function(data) {
	if(data.err) {
		return;
	} else {
		updateGameUI(MESSAGE.START_GAME, data);
	}
});
socket.on(MESSAGE.NEW_TURN, function(data) {
	if(data.err) {
		return;
	} else {
		updateGameUI(MESSAGE.NEW_TURN, data);
	}
});

module.exports = {
	VIEW, MENU, setView, setMenu,
};