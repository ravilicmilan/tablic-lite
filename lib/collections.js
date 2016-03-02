Games = new Mongo.Collection('games');
var suits = ['spades', 'hearts', 'diamonds', 'clubs'];
cardsArray = [];

suits.forEach(function(suit) {
	for (var i = 2; i <= 14; i++) {
		var name = i;
		var value;
		if (i === 11) name = 'A';
		if (i === 12) name = 'J';
		if (i === 13) name = 'Q';
		if (i === 14) name = 'K';

		if (i === 10 || i === 11 || i === 12 || i === 13 || i === 14 || (i === 2 && suit === 'clubs')) {
			if (i === 10 && suit === 'diamonds') {
				value = 2;
			} else {
				value = 1;
			}
		} else {
			value = 0;
		}

		cardsArray.push({
			suit: suit,
			cardValue: i,
			gameValue: value,
			name: name,
			id: name + '-' + suit
		});
	}
});