Turns = {};

Turns.inHand = function(set, card) {
	for (var i = 0; i < set.length; i++) {
		if (matchCard(set[i], card)) {
			return true;
		}
	}		
	return false;
};

Turns.findMatches = function(set, card) {
	var matches = [];
	var possibleMatches1;
	var possibleMatches2 = Turns.getMatchBySumOfCardValues(set, card);

	if (possibleMatches2) {
		_.flatten(possibleMatches2);
		matches.push(possibleMatches2);
		console.log(possibleMatches2);
		set = _.difference(set, possibleMatches2);
	}

	if (set.length > 0) {
		possibleMatches1 = Turns.getMatchByCard(set, card);
	}
		
	if (possibleMatches1) {
		matches.push(possibleMatches1);
	}

	return _.flatten(matches);
};

Turns.getMatchByCard = function(set, card) {
	var matches = [];

	set.forEach(function (tableCard) {
	    if (tableCard.cardValue === card.cardValue) 
	    	matches.push([tableCard]);
	});

	if (matches.length > 0) {
		return _.flatten(matches);
	}

	return false;
};

Turns.getMatchBySumOfCardValues = function(set, card) {
	var matches = [];
	
	for (var i = 2; i <= set.length; i++) {
		combinations(set, i, function(potentialMatch) {
			if (sumCards(potentialMatch) === card.cardValue) {
				matches.push(potentialMatch.slice());
			}
		});
	}

	if (matches.length > 0) {
		return matches;
	}

	return false;
};


Turns.takeMatch = function(game, id, card, match) {
	match.forEach(function(matchingCard) {
		game.players[id].pile.push(matchingCard);
		game.table = Turns.removeCard(matchingCard, game.table);
	});

	game.players[id].pile.push(card);

	game.lastScorer = id;

	if (game.table.length === 0) {
		game.players[id].score.recke++;
	}
};

Turns.removeCard = function(card, set) {
	return set.filter(function(setCard) {
		return !matchCard(card, setCard);
	});
};

function sumCards(set) {
	return set.reduce(function(a, b) {
		return a + b.cardValue;
	}, 0);
}

function matchCard(a, b) {
	return a.name === b.name && a.suit === b.suit;
}

function combinations(numArr, choose, callback) {
    var len = numArr.length;
	var c = [];

	var inner = function(start, choose_) {
		if (choose_ == 0) {
			callback(c);
		} else {
			for (var i = start; i <= len - choose_; ++i) {
				c.push(numArr[i]);
				inner(i + 1, choose_ - 1);
				c.pop();
			}
		}
	};
	inner(0, choose);
}
