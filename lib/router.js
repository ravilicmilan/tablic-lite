Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function() {
	this.route('main', {
		path: '/',
		template: 'main'
	});

	this.route('about', {
		path: '/about',
		template: 'about'
	});

	this.route('play', {
		path: '/game/:_id',
		subscriptions: function() {
		    return Meteor.subscribe('game', this.params._id);
		},
		data: function() {
			var id = this.params._id;
			var game = Games.findOne({_id: id});
			if (game) {
				game.player = game.players[Meteor.userId()];
				game.yourTurn = game.currentTurn[0] === Meteor.userId();

				var otherId = game.currentTurn[game.yourTurn ? 1 : 0];
				game.otherPlayer = {
					username: Meteor.users.findOne(otherId).username,
					score: game.players[otherId].score
				};		

				if (game.winner) {
					if (game.winner === 'tie') {
						game.message = "It's a tie";
					} else if (game.winner === Meteor.userId()) {
						game.message = "You Won!";
					} else {
						game.message = "You Lost!";
					}
				}		

				return game;
			}
		}
	});
});