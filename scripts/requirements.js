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
			if (min) {
				var units = db_units.findOne();
				
				// Transform to array of objects and split into categories for better viewing
				nutlist = _.map(min, function(val,key){ return {nutrient: key, minVal: val, maxVal:(max[key]>="0"?max[key]:"-"), unit:units[key]} });
				var minerals = nutlist.findIndex(function(e){ return e.nutrient == "Calcium"; });
				var macros = nutlist.findIndex(function(e){ return e.nutrient == "Protein"; });
				return [{type:'Macro-Nutrients', list:nutlist.slice(macros)},
						{type:'Vitamins', list:nutlist.slice(1, minerals)}, 
						{type:'Minerals', list:nutlist.slice(minerals, macros)} ];
			};
		}
	});
}