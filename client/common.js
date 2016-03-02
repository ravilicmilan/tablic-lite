Meteor.startup(function() {
    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_AND_EMAIL'
    });
}); 

Meteor.subscribe('games');
Meteor.subscribe('users');
