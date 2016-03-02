GameFactory = {};

GameFactory.createGame = function (playerIds) {
	var players = createPlayers(playerIds);

	var deck = _.shuffle(cardsArray);

	GameFactory.dealPlayers(players, deck);

	var table = dealTable(deck);

	return {
		deck: deck,
		players: players,
		table: table,
		currentTurn: playerIds,
		inProgress: true,
		started: new Date()
	}
};

GameFactory.dealPlayers = function(players, deck) {
	for (var i = 0; i < 6; i++) {
		Object.keys(players).forEach(function(id) {
			players[id].hand.push(deck.shift()); 
		});
	}
};


function createPlayers(ids) {
	var o = {};

	ids.forEach(function(id) {
		o[id] = {
			hand: [],
			pile: [],
			score: {
				points: 0,
				mostCards: 0,
				recke: 0
			}
		};
	});

	return o;
};

function dealTable(deck) {
	var c = deck.shift.bind(deck);
	return [c(), c(), c(), c()];
};