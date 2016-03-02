function otherId(game) {
	return game.currentTurn[game.currentTurn[0] === Meteor.userId() ? 1 : 0];
};

Template.userList.helpers({
	users: function () {
		var myId = Meteor.userId();
		var cantPlayAgainst = [myId];

		Games.find({inProgress: true}).forEach(function(game) {
			cantPlayAgainst.push(otherId(game));
		});


		return Meteor.users.find({_id: {$not: {$in: cantPlayAgainst}}, 'status.online': true}, {sort: {username: 1}});
	}
});

Template.userItem.events({
	'click span.label-success': function(e, t) {
		Meteor.call('createGame', t.data._id);
	}
});

Template.userItem.labelClass = function() {
	if (this.status.idle)
		return "label-warning";
	else if (this.status.online)
		return "label-success";
	else
		return "label-default";
};

Template.gameList.helpers({
	games: function() {
		var userId = Meteor.userId();
		return Games.find({inProgress: true, currentTurn: userId}).map(function(game) {
			game.otherPlayer = Meteor.users.findOne(otherId(game)).username;
			game.started = moment(game.started).fromNow();
			return game;
		});
	},

	completedGames: function() {
		var userId = Meteor.userId();
		return Games.find({inProgress: false, currentTurn: userId}).map(function(game) {
			game.otherPlayer = Meteor.users.findOne(otherId(game)).username;
			game.finished = moment(game.finished).fromNow();

			if (game.winner === 'tie') {
				game.message = "Tied";
			} else if (game.winner === Meteor.userId()) {
				game.message = "Won";
			} else {
				game.message = "Lost";
			}

			return game;
		});
	}
});

Template.gameList.events({
	'click #deleteAll': function(e, t) {
		Meteor.call('deleteCompletedGames', Meteor.userId());
	}
});

Template.gameItem.events({
	'click .decline-game': function(e, t) {
		var gameId = t.data._id;

		Meteor.call('declineGame', gameId);
	}
});