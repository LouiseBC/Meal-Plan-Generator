db_reqs = new Mongo.Collection('requirements');
db_limits = new Mongo.Collection('limits');
db_units = new Mongo.Collection('units');

function User(gender, height, weight, age) {
		this.gender = gender;
		this.height = height;
		this.weight = weight;
		this.age = this.enumerateAge(age);
		this.requirements = this.getRequirements(this.age, this.gender, this.weight);
		this.limits = this.getLimits(this.age, this.gender);
}

User.prototype.getRequirements = function(age, gender, weight) {
	var reqs = db_reqs.findOne({Gender:gender, Age:age});
	reqs.Protein *= weight;
	delete reqs.Gender;
	delete reqs.Age;
	return reqs;
}

User.prototype.getLimits = function(age, gender) {
	var upperLimits = db_limits.findOne({Gender:gender, Age:age});
	delete upperLimits.Gender;
	delete upperLimits.Age;
	return upperLimits;
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
