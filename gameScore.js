scoreGame = function (game) {
	game.players[game.lastScorer].pile.push.apply(game.players[game.lastScorer].pile, game.table);
	game.table = [];
	game.inProgress = false;
	game.finished = new Date();

	var mostCards = ['x', -1];

	Object.keys(game.players).forEach(function(id) {
		var pile = game.players[id].pile;
		var cardCount = pile.length;
		var points = totalPoints(pile);

		if (cardCount > mostCards[1]) {
			mostCards = [id, cardCount];
		} else if (cardCount === mostCards[1]) {
			mostCards = false;
		}

		game.players[id].score.points += points;
	});

	if (mostCards) {
		game.players[mostCards[0]].score.mostCards = 3;
	}

	var highest = ['x', -1];

	Object.keys(game.players).forEach(function(id) {
		var s = game.players[id].score;

		game.players[id].score.total = s.mostCards + s.points + s.recke;

		if (game.players[id].score.total > highest[1]) {
			highest = [id, game.players[id].score.total];
		} else if (game.players[id].score.total === highest[1]) {
			highest = false;
		} 
	});

	game.winner = highest ? highest[0] : 'tie';
}; 

function suit(suit, cards) {
	return cards.filter(function(card) {
		return card.suit === suit;
	});
};

function totalPoints(cards) {
	var sum = 0;
	cards.forEach(function(card) {
		sum += card.gameValue;
	});
	return sum;
}