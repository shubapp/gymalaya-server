// server/models/user.js
var mongoose = require('mongoose');
var Schema 		= mongoose.Schema;

var userSchema = mongoose.Schema({
	_id					:{type: String, required: true},
	firstName			:{type: String, required: true},
	lastName			:String,
	registration		:{type: Date, required: true, default: Date.now},
	birthday			:Date
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema, 'users');