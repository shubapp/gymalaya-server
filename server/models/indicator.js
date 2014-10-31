// server/models/indicator.js
var mongoose = require('mongoose');
var Schema 		= mongoose.Schema;

var indicatorSchema = mongoose.Schema({
	user			:{type: String, required: true, ref:'User'},
	date			:{type: Date, required: true, default: Date.now},
	pic				:String,
	weight			:Number
});

// create the model for indicator and expose it to our app
module.exports = mongoose.model('Indicator', indicatorSchema, 'indicators');