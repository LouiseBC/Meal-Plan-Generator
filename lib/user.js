db_reqs = new Mongo.Collection('requirements');
db_limits = new Mongo.Collection('limits');
db_units = new Mongo.Collection('units');
db_nutNos = new Mongo.Collection('nutNos');

if (Meteor.isServer) {
	Meteor.publish('requirements', function() {
	   return db_reqs.find();
	});
	Meteor.publish('limits', function() {
	   return db_limits.find();
	});
	Meteor.publish('units', function() {
	   return db_units.find();
	});
	Meteor.publish('nutNos', function() {
	   return db_nutNos.find();
	});
}

function User(gender, height, weight, age, activity) {
	this.gender = gender;
	this.height = height;
	this.weight = weight;
	this.activity = activity;
	this.age = this.enumerateAge(age);
	this.reqsMin = this.getReqsMin(age);
	this.reqsMax = this.getReqsMax();
	this.nutNos = this.getNutNos();
}

User.prototype.getReqsMin = function(actualAge) {
	var reqs = db_reqs.findOne({Gender:this.gender, Age:this.age});
	reqs.Protein = (reqs.Protein*this.weight).toFixed(1);
	reqs.Calories = this.calcCalories(actualAge);
	reqs.Fat = ((reqs.Calories * 0.1)/9).toFixed(1);
	delete reqs.Gender;
	delete reqs.Age;
	return reqs;
}

User.prototype.getReqsMax = function() {
	var reqs = db_limits.findOne({Gender:this.gender, Age:this.age});
	delete reqs.Gender;
	delete reqs.Age;
	return reqs;
}

User.prototype.getNutNos = function() {
	var nutNos = {};
	var keys = Object.keys(this.reqsMin);
	var nos = db_nutNos.findOne();
	for (i = 0; i < keys.length; ++i) {
		nutNos[keys[i]] = nos[keys[i]];
	}
	return nutNos;
}

User.prototype.calcCalories = function(age) {
	// BMR Calculated using the Mifflin St Jeor formula
	var calories = (10 * this.weight) + (6.25 * this.height) - (5 * age);
	this.gender=="Female" ? calories -= 161 : calories += 5;


	// Multiply by activity factor
	var m = 0;
	switch(this.activity) {
	  case "sedentary": m = 1.2; break;
	  case "light": m = 1.375; break;
	  case "moderate": m = 1.55; break;
	  case "very": m = 1.725; break;
	  case "extreme": m = 1.9; break;
	}
	calories *= m;

	return calories.toFixed(0);
}

User.prototype.enumerateAge = function(age) {
	var ages = {
		TWEEN: 0,
		TEEN: 1,
		YADULT: 2,
		ADULT: 3,
		SENIOR: 4,
		ELDER: 5
	}

	if (age >= 9 && age <= 13) {
		return ages.TWEEN
	}
	else if (age >= 14 && age <= 18) {
		return ages.TEEN
	}
	else if (age >= 19 && age <= 30) {
		return ages.YADULT
	}
	else if (age >= 31 && age <= 50) {
		return ages.ADULT
	}
	else if (age >= 51 && age <= 70) {
		return ages.SENIOR
	}
	else {
		return ages.ELDER
	}
}

this.User = User;
