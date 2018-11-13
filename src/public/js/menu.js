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

function setView(viewKey) {
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

setView('LANDING');
setMenu('FIRST');

// sync username field for create and join menus
var proposedUsername = undefined;
$('input#create-username').on('input', function(e) {
	proposedUsername = this.value;
	$('input#join-username').val(proposedUsername);
});
$('input#join-username').on('input', function(e) {
	proposedUsername = this.value;
	$('input#create-username').val(proposedUsername);
});

// TODO validate username

$('form').on('submit', function(e) {
	e.preventDefault();
	$(`#${this.id} .btn`).prop('disabled', true);
	$(`#${this.id} input`).prop('disabled', true);
});
$('form#create-game-form').on('submit', function(e) {
	// setView('LOADING');
});
$('form#join-game-form').on('submit', function(e) {
	// setView('LOADING');
});