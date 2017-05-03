db_nut_data = new Mongo.Collection('nutData');
db_fd_desc = new Mongo.Collection('fdDesc');

if (Meteor.isServer) {
   Meteor.methods({
      'generateMenu': function(user) {
         // Retreive a list of the nutrients to search for
         let nutrients = Object.keys(user.reqsMin).slice(1);

         // List of NDBNOs of selected foods
         let foods = [];

         // Store amount of each nutrient contained in foods
         let currValues = {};

         // Find 20 foods highest in x
         let options = db_nut_data.find({ Nutr_No: user.nutNos[nutrients[1]] }, { sort:{Nutr_Val:-1}, limit:5 }).fetch();
         let food = db_fd_desc.find({ NDB_No:options[0].NDB_No },{ Long_Desc:1 }).fetch();
         console.log('fetching highest in ' + nutrients[1] + ':');
         console.log(options);
      }
   });

   function Food() {

   }
}
