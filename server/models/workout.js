// server/models/group.js
var mongoose = require('mongoose');

var workoutSchema = mongoose.Schema({
	user 				:[{type:String, ref:'User'}],
	name				:String,
	creation			:{type: Date, required: true, default: Date.now},
	end					:Date
});

// create the model for workout and expose it to our app
module.exports = mongoose.model('Workout', workoutSchema, 'workouts');