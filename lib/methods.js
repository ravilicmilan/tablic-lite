Meteor.methods({
	createGame: function(otherPlayerId) {
		var game = GameFactory.createGame([Meteor.userId(), otherPlayerId]);

		Games.insert(game);
	},

	declineGame: function(gameId) {
		Games.remove(gameId);
	},

	deleteCompletedGames: function(userId) {
		Games.remove({players: userId});
	},

	takeTurn: function(gameId, id, card, selectedCards) {
		console.log('called!');
		var game = Games.findOne(gameId);
		var hand = game.players[id].hand;

		if (game.currentTurn[0] !== id || !Turns.inHand(hand, card)) {
			return;
		}

		var match;

		if (selectedCards.length === 0) {
			game.players[id].hand = Turns.removeCard(card, hand);
			game.table.push(card);
			game.currentTurn.unshift(game.currentTurn.pop());
		} else {
			match = Turns.findMatches(selectedCards, card);

			if (match.length > 0) {
				Turns.takeMatch(game, id, card, match);
				game.players[id].hand = Turns.removeCard(card, hand);
				game.currentTurn.unshift(game.currentTurn.pop());
			} else {
				toastr.error('That is illegal move!');
				return;
			}
		}

		if (allHandsEmpty(game.players)) {
			if (game.deck.length > 0) {
				GameFactory.dealPlayers(game.players, game.deck);
			} else {
				scoreGame(game);
			}
		}
		
		Games.update(gameId, game);
	}
});

function allHandsEmpty(players) {
	return _.every(players, function(player) {
		return player.hand.length === 0;
	});
};