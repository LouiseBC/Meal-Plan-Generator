if (Meteor.isClient) {
	Template.userDetails.events({
		'submit form': function(event) {
			event.preventDefault();
			var gender = event.target.gender.value;
			var weight = event.target.weight.value;
			var height = event.target.height.value;
			var age = event.target.age.value;
			var activity = event.target.activity.value;
			if (gender && weight && height && age) {
				var user = new User(gender, height, weight, age, activity);
				Session.set('reqsMin', user.reqsMin);
				Session.set('reqsMax', user.reqsMax);
			}
		}
	});

	Template.nutrientReqs.helpers({
		'getReqs': function() {
			var min = Session.get('reqsMin');
			var max = Session.get('reqsMax');
			var units = db_units.findOne();
			min = _.map(min, function(val,key){ return {nutrient: key, value: val, maxVal:(max[key]>="0"?max[key]:"-"), unit:units[key]} });
			return min.slice(1);
		}
	});
}