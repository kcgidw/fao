class Player {
	constructor(name, isHost = false, color) {
		this.name = name;
		this.isHost = isHost;
		this.color = color;
		this.isFaker = false; // TODO remove client-side visibility
	}
	setFaker(isFaker) {
		this.isFaker = isFaker;
	}
}

export {Player};