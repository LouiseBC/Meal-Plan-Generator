db_nut_data = new Mongo.Collection('nutData');
db_fd_desc = new Mongo.Collection('fdDesc');
db_weight = new Mongo.Collection('weight');

if (Meteor.isServer) {
   Meteor.methods({
      'generateMenu': function(user) {
         // Retrieve a list of the nutrient nos to search for
         let nutrients = Object.values(user.nutNos).slice(1);

         // List to store selected foods
         let foods = [];

         // Store amount of each nutrient contained in foods
         let currValues = nutrients.reduce( function(nums, i) { nums[i] = 0; return nums; }, {} );

         let target = lowestUnmetNutrient(user, currValues);
         while (target) {
            // Find n foods highest in x
            let n = 10;
            console.log('fetching highest in ' + target + ':');
            let options = db_nut_data.find({ Nutr_No: target }, { sort:{Nutr_Val:-1}, limit:n }).fetch();

            // Pick (eventually) a random one and collect other data
            let rand = Math.floor(Math.random() * ((n-1) - 0 + 1)) + 0;
            let choice = Food(options[rand].NDB_No);

            for (i = 0; i < nutrients.length; ++i) {
               nutPerPortion = (choice.nutrients[nutrients[i]] || 0) * 0.01 * choice.servingSize.Gm_Wgt;
               currValues[nutrients[i]] += nutPerPortion;
            }
            foods.push(choice);
            console.log(choice.name);
            target = lowestUnmetNutrient(user, currValues);
         }
         foods.foreach(function(n) { console.log(n.name); } );
         console.log(currValues);
      }
   });

   function lowestUnmetNutrient(user, currValues) {
      let lowestVal = 1;
      let nutNo = false;

      Object.keys(user.reqsMin).slice(1).forEach(function(req) {
         // if req in [calories, chol, fat, etc.]
         if (req == 'Calories') { return; }

         let pCompleted = currValues[user.nutNos[req]] / user.reqsMin[req];
         //console.log(req + ": " + currValues[user.nutNos[req]] + ' / ' + user.reqsMin[req] + ' = ' + pCompleted);

         if (pCompleted < lowestVal) {
            lowestVal = pCompleted;
            nutNo = user.nutNos[req];
         }
      });
      return nutNo;
   }

   function Food(NDB_No) {
      let food = {}

      food.ndbNo = NDB_No;
      food.name = db_fd_desc.findOne({ NDB_No:NDB_No },{ fields: {Long_Desc:1, _id:0} }).Long_Desc;
      food.nutrients = db_nut_data.find({ NDB_No:NDB_No },{ fields:{_id:0, NDB_No:0} }).fetch();
      food.servingSize = db_weight.findOne({ NDB_No:"04589", Seq:"1"},{ fields:{_id:0, NDB_No:0}});
      food.nutrients = food.nutrients.reduce(function(acc, val) {
         acc[val.Nutr_No] = val.Nutr_Val;
         return acc;
      }, {});

      return food;
   }
}
