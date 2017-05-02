db_fd_desc = new Mongo.Collection('fd_desc');
db_nut_data = new Mongo.Collection('nut_data');

/** Code Only Works In Shell
// Get NDB Numbers of All Foods in DB
ndbnos = db.db_food_desc.find({},{NDB_No:1, _id:0});
//ndbnos = _.map(ndbnos, function(value, index){ return [value]} );

for (i = 0; i < ndbnos.length(); ++i) {
	// Get the amount of calories in each food
	calories = db.db_nutr_data.findOne( {'NDB_No':ndbnos[i].NDB_No, 'Nutr_No':'208'}, {_id:0}).Nutr_Val;
	if (calories > 0) { // screw 0-calorie foods
		// Add field specifying nutrient(unit) per calorie
		db.db_nutr_data.find( {'NDB_No':ndbnos[i].NDB_No}).forEach( function(e) {
			e['Nutr_Pcal'] = e.Nutr_Val / calories;
			db.db_nutr_data.save(e, {_id:e._id});
		});
	}
}
//**/