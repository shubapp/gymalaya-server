// server/models/mgroup.js
var mongoose = require('mongoose');

var mgroupSchema = mongoose.Schema({
	_id				:{type: String, required: true}
});

// create the model for mgroup and expose it to our app
module.exports = mongoose.model('Mgroup', mgroupSchema, 'mgroups');