<template>
<div id="home-menu" class="flex-center">
    <div id="first-prompt-menu" class="menu" v-show="tab === 'main'">
        <button id="goto-create-menu" class="btn big primary" @click="goto('create')">New Game</button>
        <div style="clear: both"></div>
        <button id="goto-join-menu" class="btn big primary" @click="goto('join')">Join Game</button>
        <div style="clear: both"></div>
        <button class="btn big secondary" @click="gotoRules()">Rules</button>
    </div>

    <div id="create-game-menu" class="menu" v-show="tab === 'create'">
        <div class="warning" v-show="createWarning !== undefined">
            <p>{{createWarning}}</p>
        </div>
        <form id="create-game-form" @submit.prevent="createGame">
            <input type="text" id="create-username-input" class="username-input" placeholder="Username" required autocomplete="off" v-model="username"/>
            <div style="clear: both"></div>
            <div class="form-actions">
                <button type="button" id="create-game-back-btn" class="btn tertiary" @click="goto('main')">Back</button>
                <button type="submit" id="create-game-btn" class="btn primary" value="" :disabled="!Boolean(username)">Create</button>
            </div>
        </form>
    </div>

    <div id="join-game-menu" class="menu" v-show="tab === 'join'">
        <div class="warning" v-show="joinWarning !== undefined">
            <p>{{joinWarning}}</p>
        </div>
        <form id="join-game-form" @submit.prevent="joinGame">
            <input type="text" id="join-username-input" class="username-input" placeholder="Username" required autocomplete="off" v-model="username"/>
            <div style="clear: both"></div>
            <input type="tel" id="join-code" placeholder="Game Code" required autocomplete="off" v-model="roomCode"/>
            <div style="clear: both"></div>
            <div class="form-actions">
                <button type="button" id="join-game-back-btn" class="btn tertiary" @click="goto('main')">Back</button>
                <button type="submit" id="join-game-btn" class="btn primary" :disabled="!Boolean(username && roomCode)">Join</button>
            </div>
        </form>
    </div>
</div>
</template>

<script>
const Store = require('./state');
const VIEW = require('./view');

export default {
	name: 'home-menu',
	components: {
	},
	props: ['initialUsername', 'initialRoomCode', 'createWarning', 'joinWarning'],
	data() {
		return {
			username: this.initialUsername,
			tab: 'main',
			roomCode: this.initialRoomCode,
		};
	},
	methods: {
		goto(value) {
			this.tab = value;
		},
		gotoRules() {
			Store.setView(VIEW.RULES);
		},
		createGame() {
			Store.submitCreateGame(Store.state.username);
		},
		joinGame() {
			Store.submitJoinGame(this.roomCode, Store.state.username);
		},
	},
	watch: {
		username(val) {
			Store.setUsername(val);
		}
	}
};
</script>
