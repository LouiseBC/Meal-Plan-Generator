if (Meteor.isClient) {
	Template.userDetails.events({
		'submit form': function(event) {
			event.preventDefault();
			var gender = event.target.gender.value;
			var weight = event.target.weight.value;
			var height = event.target.height.value;
			var age = event.target.age.value;
			if (gender && weight && height && age) {
				var user = new User(gender, height, weight, age);
				Session.set('reqsMin', user.reqsMin);
			}
		}
	});

	Template.nutrientReqs.helpers({
		'getReqsMin': function() {
			var reqs = Session.get('reqsMin');
			var units = db_units.findOne();
			reqs = _.map(reqs, function(val,key){ return {nutrient: key, value: val, unit:units[key]} });
			return reqs.slice(1);
		}
	});
}