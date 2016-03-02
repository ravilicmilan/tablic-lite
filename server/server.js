Meteor.publish('games', function() {
	return Games.find();
});


Meteor.publish('users', function() {
	return Meteor.users.find({}, {fields: {username: 1, emails: 1, status: 1}});
});    