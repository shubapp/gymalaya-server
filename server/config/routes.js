var auth			= require('./auth');
var User			= require('../models/user.js');
var Workout			= require('../models/workout.js');
var Mgroup			= require('../models/mgroup.js');
var Indicator		= require('../models/indicator.js');
var Exercise		= require('../models/exercise.js');

module.exports = function(app, passport){
	//--------------------------------
	// 		LOCAL LOGIN - PLAYER
	//--------------------------------
	app.post('/auth/userlogin', function(req, res) {
		passport.authenticate('user-login', function(err, user) {
			req.login(user, {}, function(err) {
				if (err) { return res.json({error:err}); }
				return res.json(user);
	        });
		}) (req, res);
	});


	app.get('/logout', function(req, res) {
		req.logout();
		res.status(200).end();
	});
	//--------------------------------

	app.get('/mgroups', auth.isLoggedIn, function(req, res) {
		Mgroup.find({}, function(err, mgroups){
			res.json(mgroups);
		});
	});

	app.get('/workouts', auth.isLoggedIn, function(req, res) {
		Workout.find({user:req.user._id})
		.exists('end', false)
		.sort('creation')
		.exec(function(err, workouts){
			res.json(workouts);
		});
	});

	app.get('/exercises/:workoutId', auth.isLoggedIn, function(req, res) {
		Exercise.find({workout:req.patams.workoutId})
		.exists('endDate', false)
		.exec(function(err, exercises){
			res.json(exercises);
		});
	});

	app.get('/indicators', auth.isLoggedIn, function(req, res) {
		Indicator.find({user:req.user._id})
		.sort('date')
		.exec(function(err, indicators){
			res.json(indicators);
		});
	});

	app.post('/workout', auth.isLoggedIn, function(req, res) {
		var workout = new Workout(req.body);
		workout.save(function(err){
			if (err) {res.json(err)}
			res.json({result:true});
		});
	});

	app.post('/exercise', auth.isLoggedIn, function(req, res) {
		var exercise = new Exercise(req.body);
		exercise.save(function(err){
			if (err) {res.json(err)}
			res.json({result:true});
		});
	});

	app.post('/indicator', auth.isLoggedIn, function(req, res) {
		// TODO: file upload + handle file name
		var originalname = req.files.file.originalname;
		var indicator = new Indicator(req.body);
		indicator.pic = originalname;
		indicator.save(function(err){
			if (err) {res.json(err)}
			res.json({result:true});
		});
	});

	app.delete('/workout', auth.isLoggedIn, function(req, res) {
		Workout.findById(req.body._id,function(err, workout){
			workout.end = new Date();
			workout.save(function(err){
				if (err) {res.json(err)}
				res.json({result:true});
			});
		});
	});

	app.delete('/exercise', auth.isLoggedIn, function(req, res) {
		Exercise.findById(req.body._id,function(err, exercise){
			exercise.endDate = new Date();
			exercise.save(function(err){
				if (err) {res.json(err)}
				res.json({result:true});
			});
		});
	});

	app.put('/workout/:_id', auth.isLoggedIn, function(req, res) {
		Workout.findById(req.params._id,function(err, workout){
			workout.name = req.body.name;
			workout.save(function(err){
				if (err) {res.json(err)}
				res.json({result:true});
			});
		});
	});

	app.put('/exercise/:_id', auth.isLoggedIn, function(req, res) {
		Exercise.findById(req.params._id,function(err, exercise){
			exercise.name = req.body.name;
			exercise.save(function(err){
				if (err) {res.json(err)}
				res.json({result:true});
			});
		});
	});
}