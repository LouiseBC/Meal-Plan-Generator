db_food_groups = new Mongo.Collection('usda_fd_group');
db_weight = new Mongo.Collection('usda_weight');
db_food_desc = new Mongo.Collection('usda_food_desc');
db_nutr_data = new Mongo.Collection('usda_nut_data');
db_nutr_def = new Mongo.Collection('usda_nutr_def');
db_search = new Mongo.Collection('usda_datasrcln');

/** Code Only Works In Shell
// Get NDB Numbers of All Foods in DB
ndbnos = db.db_food_desc.find({},{NDB_No:1, _id:0});
ndbnos = _.map(ndbnos, function(value, index){ return [value]} );

for (i = 0; i < ndbnos.size(); ++i) {
	// Get the amount of calories in each food
	calories = db.db_nutr_data.findOne( {'NDB_No':ndbnos[i].NDB_No, 'Nutr_No':'208'}, {_id:0}).Nutr_Val;
	// Add field specifying nutrient(unit) per calorie
	db.db_nutr_data.find( {'NDB_No':ndbnos[i].NDB_No}, {_id:0} ).forEach( function(e) {
		e['Nutr_Pcal'] = e.Nutr_Val / calories;
		db.db_nutr_data.save(e);
	});
}
//**/