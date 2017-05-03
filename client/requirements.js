Template.userDetails.onCreated(function() {
	Meteor.subscribe('requirements');
	Meteor.subscribe('limits');
	Meteor.subscribe('units');
	Meteor.subscribe('nutNos');
})

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
			Session.set('user', user);
		}
	}
});

Template.nutrientReqs.helpers({
	'getReqs': function() {
		var user = Session.get('user');
		if (user) {
			var units = db_units.findOne();

			// Combine all data into array of objects
			var nutlist = _.map(user.reqsMin, function(val,key){ return {
				nutrient: key,
				minVal: val,
				maxVal:(user.reqsMax[key]>="0"?user.reqsMax[key]:"-"),
				unit:units[key]}
			});

			// Split into categories for better viewing
			var minerals = nutlist.findIndex(function(e){ return e.nutrient == "Calcium"; });
			var macros = nutlist.findIndex(function(e){ return e.nutrient == "Protein"; });
			return [	{type:'Macronutrients', list:nutlist.slice(macros)},
						{type:'Vitamins', list:nutlist.slice(1, minerals)},
						{type:'Minerals', list:nutlist.slice(minerals, macros)}	];
		};
	}
});
