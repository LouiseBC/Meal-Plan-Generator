db_reqs = new Mongo.Collection('requirements');
db_limits = new Mongo.Collection('limits');
db_units = new Mongo.Collection('units');

function User(gender, height, weight, age, activity) {
		this.gender = gender;
		this.height = height;
		this.weight = weight;
		this.activity = activity;
		this.age = this.enumerateAge(age);
		this.reqsMin = this.getReqsMin(this.age, this.gender, this.weight);
		this.reqsMax = this.getReqsMax(this.age, this.gender);
}

User.prototype.getReqsMin = function(age, gender, weight) {
	var reqs = db_reqs.findOne({Gender:gender, Age:age});
	reqs.Protein = (reqs.Protein*weight).toFixed(1);
	reqs.Calories = this.calcCalories();
	delete reqs.Gender;
	delete reqs.Age;
	return reqs;
}

User.prototype.calcCalories = function() {
	// BMR Calculated using the Mifflin St Jeor formula
    var calories = 10 * this.weight + 6.25 * this.height - 5 * this.age;
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

User.prototype.getReqsMax = function(age, gender) {
	var reqs = db_limits.findOne({Gender:gender, Age:age});
	delete reqs.Gender;
	delete reqs.Age;
	return reqs;
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
