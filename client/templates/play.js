Template.hand.events({
	'click .card': function(e, t) {
		var selectedCards = Session.get('selectedCards') || [];
		var cardToPlay = null;

		cardToPlay = $(this)[0];

		if (!t.data.yourTurn) {
			toastr.error('You can not play yet! Wait for your turn.');
			return;
		}

		if (t.data.yourTurn && cardToPlay && selectedCards) {
			selectedCards.forEach(function(card) {
				if (card.name == 'A') {
					card.cardValue = parseInt(card.cardValue);
				}
			});

			if (selectedCards.length === 1 && selectedCards[0].name === 'A') {
				selectedCards[0].cardValue = 11;
			}

			Meteor.call('takeTurn', t.data._id, Meteor.userId(), cardToPlay, selectedCards);
			cardToPlay = null;
			selectedCards = [];
			clearSession();
		}

		clearSession();
		
		$('.card-table').each(function(idx, el) {
			$(el).removeClass('card-selected');
		});

		cardToPlay = null;
		selectedCards = [];
	}
});

Template.tableCard.events({
	'click .card-table img': function(e, t) {
		var card = this;
		var cachedCards = Session.get('cachedCards') || [];
		var selectedCards = [];

		if (card.name === 'A' && _.findWhere(cachedCards, {id: card.id}) === undefined) {
			openDialog(card);
		}

		var table = t.data.table;
		var id = card.id;
		var cardIds = Session.get('cardIds') || [];
		var arr = [];

		addOrRemoveObj(cachedCards, card);

		addOrRemove(cardIds, id);

		cardIds.forEach(function(cardId) {
			for (var j = 0; j < cachedCards.length; j++) {
				if (cachedCards[j].id === cardId) {
					selectedCards.push(cachedCards[j]);
				}
			}
		});

		Session.set('cardIds', cardIds);
		Session.set('cachedCards', selectedCards);
		Session.set('selectedCards', selectedCards);

		$(e.currentTarget).parent().toggleClass('card-selected');
	},

	'click .ace-btn': function(e, t) {
		var val = parseInt($(e.currentTarget).data('id'));
		var aceId = $('#ace-dialog').text();
		var selectedCards = Session.get('selectedCards') || [];


		selectedCards.forEach(function(card) {
			if (card.name === 'A' && card.id === aceId) {
				card.cardValue = parseInt(val);
			}
		});

		Session.set('selectedCards', selectedCards);	
		Session.set('cachedCards', selectedCards);	
		this.cardValue = val;
		closeDialog();
	}
});

function addOrRemoveObj(objArr, obj) {
	var index = -1;
	for (var i = 0; i < objArr; i++) {
		if (objArr[i].id === obj.id) index = i;
		else index = -1;
	}
    
    
    if (index === -1) {
        objArr.push(obj);
    } else {
        objArr.splice(index, 1);
    }
}

function addOrRemove(array, value) {
    var index = array.indexOf(value);
    
    if (index === -1) {
        array.push(value);
    } else {
        array.splice(index, 1);
    }
}

function openDialog(card) {
	$('#myModal').modal({
	  	keyboard: false,
	  	backdrop: 'static'
	});
	$('#ace-dialog').text(card.id);
}

function closeDialog() {
	$('#myModal').modal('hide');
}

function clearSession() {
	Session.set('cardIds', null);
	Session.set('selectedCards', null);
	Session.set('cachedCards', null);
}

Template.tableCard.helpers({
	generateId: function() {
		return parseInt(Math.random() * 10000000000);
	}
});