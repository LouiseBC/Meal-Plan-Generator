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
				Session.set('nutrients', user.requirements);
			}
		}
	});

	Template.nutrientReqs.helpers({
		'getNutrients': function() {
			var reqs = Session.get('nutrients');
			var unitlist = units.findOne();
			reqs = _.map(reqs, function(val,key){ return {nutrient: key, value: val, unit:unitlist[key]} });
			return reqs.slice(1);
		}
	});
}