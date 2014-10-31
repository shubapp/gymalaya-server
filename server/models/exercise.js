// server/models/exercise.js
var mongoose = require('mongoose');
var Schema 		= mongoose.Schema;

var exerciseSchema = mongoose.Schema({
	name				:{type: String, required: true},
	workout				:{type: Schema.ObjectId, required: true, ref:'Workout'},
	weight				:Number,
	sets				:Number,
	repetitions			:Number,
	startDate			:{type: Date, required: true, default: Date.now},
	endDate				:Date,
	mgroup				:{type:String, ref:'Mgroup'}
});

// create the model for exercise and expose it to our app
module.exports = mongoose.model('Exercise', exerciseSchema, 'exercises');