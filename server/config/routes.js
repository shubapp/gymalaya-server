var fs				= require('fs');
var path			= require('path');
var async			= require('async');
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

	app.post('/loggedin',function(req,res) {
		res.json(req.isAuthenticated() ? req.user : {err:"Not logged in"});
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
		Exercise.find({workout:req.params.workoutId})
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
		workout.user=req.user._id;
		workout.save(function(err,savedWorkout){
			if (err) {res.json(err)}
			res.json(savedWorkout);
		});
	});

	app.post('/exercise', auth.isLoggedIn, function(req, res) {
		var exercise = new Exercise(req.body);
		exercise.save(function(err, savedExercise){
			if (err) {res.json(err);}
			res.json(savedExercise);
		});
	});

	app.post('/indicator', auth.isLoggedIn, function(req, res) {
		var originalname = req.files.file.name;

		var indicator = new Indicator({user:req.user._id,pic:originalname,weight:req.body.weight});
		indicator.save(function(err, savedIndicator){
			if (err) {res.json(err)}
			res.json(savedIndicator);
		});
	});

	app.delete('/workout/:workoutId', auth.isLoggedIn, function(req, res) {
		Workout.findById(req.params.workoutId,function(err, workout){
			if (err) {res.json(err);}
			workout.end = new Date();
			workout.save(function(err){
				if (err) {res.json(err)}
				res.json({result:true});
			});
		});
	});

	app.delete('/exercise/:exerciseId', auth.isLoggedIn, function(req, res) {
		Exercise.findById(req.params.exerciseId,function(err, exercise){
			if (err) {res.json(err);}
			exercise.endDate = new Date();
			exercise.save(function(err){
				if (err) {res.json(err)}
				res.json({result:true});
			});
		});
	});

	app.put('/workout/:_id', auth.isLoggedIn, function(req, res) {
		Workout.findById(req.params._id,function(err, workout){
			if (err) {res.json(err);}
			workout.name = req.body.name;
			workout.save(function(err){
				if (err) {res.json(err)}
				res.json({result:true});
			});
		});
	});

	app.put('/exercise/:_id', auth.isLoggedIn, function(req, res) {
		Exercise.findById(req.params._id,function(err, exercise){
			if (err) {res.json(err);}
			exercise.endDate = new Date();

			exercise.save(function(err){
				if (err) {res.json(err);}
				var newExercise = new Exercise(req.body);
				newExercise.startDate = new Date();
				newExercise._id=null;

				newExercise.save(function(err, savedExercise){
					if (err) {res.json(err);}
					res.json(savedExercise);
				});
			});
		});
	});

	/**********************************************************************************/

	app.get('/api/exercises', auth.isLoggedIn, function(req, res) {
		Workout.find({user:req.user._id})
		.exists('end', false)
		.exec(function(err, workouts){
			var workoutIds=[];
			for (var i = 0; i < workouts.length; i++) {
				workoutIds.push(workouts[i]._id);
			}

			Exercise.find({})
			.where('workout').in(workoutIds)
			.exists('endDate', false)
			.populate('workout','name')
			.exec(function(err, exercises){
				res.json(exercises);
			});
		});
	});

	app.get('/api/exercise/:name', auth.isLoggedIn, function(req, res) {
		Workout.find({user:req.user._id})
		.exists('end', false)
		.exec(function(err, workouts){
			var workoutIds=[];
			for (var i = 0; i < workouts.length; i++) {
				workoutIds.push(workouts[i]._id);
			}

			Exercise.find({name:req.params.name})
			.where('workout').in(workoutIds)
			.sort('startDate')
			.exec(function(err, exercises){
				res.json(exercises);
			});		
		});
	});
	
	app.get('/api/mgroup/:mgroup', auth.isLoggedIn, function(req, res) {
		Workout.find({user:req.user._id})
		.exists('end', false)
		.exec(function(err, workouts){
			var workoutIds=[];
			for (var i = 0; i < workouts.length; i++) {
				workoutIds.push(workouts[i]._id);
			}

			Exercise.find({mgroup:req.params.mgroup})
			.where('workout').in(workoutIds)
			.sort('startDate')
			.exec(function(err, exercises){
				var queries =[];
				var results=[];
				for (var i = 0; i < exercises.length; i++) {
					(function(i){
						queries.push(function(cb){
							Exercise.find({mgroup:req.params.mgroup})
							.where('startDate').lte(exercises[i].startDate)
							.or([{endDate:null},{endDate:{$gt:exercises[i].startDate}}])
							.exec(function(err, exMuscles){
								var totalStrength=0;
								for (var j = 0; j < exMuscles.length; j++) {
									totalStrength+=exMuscles[j].strength;
								}

								if (exMuscles.length>0){
									totalStrength = totalStrength/exMuscles.length;
								}

								results.push({date:exercises[i].startDate,strength:totalStrength});
								cb(err);
							});
						});
					})(i);
				}

				async.parallel(queries,function(err){
					if (err){
						res.json(err);
					}
					res.json(results);
				})
			});	
		});	
	});

	app.get('/api/totalWorkout', auth.isLoggedIn, function(req, res) {
		Workout.find({user:req.user._id})
//		.exists('end', false)
		.exec(function(err, workouts){
			var workoutIds=[];
			for (var i = 0; i < workouts.length; i++) {
				workoutIds.push(workouts[i]._id);
			}

			Exercise.find({})
			.where('workout').in(workoutIds)
			.sort('startDate')
			.exec(function(err, exercises){
				var queries =[];
				var results=[];
				for (var i = 0; i < exercises.length; i++) {
					(function(i){
						queries.push(function(cb){
							Exercise.find({})
							.where('startDate').lte(exercises[i].startDate)
							.or([{endDate:null},{endDate:{$gt:exercises[i].startDate}}])
							.exec(function(err, exMuscles){
								var totalStrength=0;
								for (var j = 0; j < exMuscles.length; j++) {
									totalStrength+=exMuscles[j].strength;
								}

								if (exMuscles.length>0){
									totalStrength = totalStrength/exMuscles.length;
								}

								results.push({date:exercises[i].startDate,strength:totalStrength});
								cb(err);
							});
						});
					})(i);
				}

				async.parallel(queries,function(err){
					if (err){
						res.json(err);
					}
					res.json(results);
				})
			});	
		});	
	});

	app.get('/uploads/:image', auth.isLoggedIn, function(req, res) {
		res.sendFile(path.resolve(__dirname , "..","uploads" , req.params.image));
	});

	app.get('*', function(req, res) {
		res.redirect('/#'+req.originalUrl);
	});
}