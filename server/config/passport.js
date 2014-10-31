'use strict';
var LocalStrategy		= 	require('passport-local').Strategy;
// var FacebookStrategy	= 	require('passport-facebook').Strategy;
// var GoogleStrategy 		=	require('passport-google-oauth').OAuth2Strategy;
var User 				=	require('../models/user');

module.exports = function(passport){
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			if (err) {
				done(err);
			}

			if (user) {
				done(null, user);
			} 
		});
	});

	//--------------------------------
	// 		LOCAL LOGIN - CLIENT
	//--------------------------------
	passport.use('user-login', new LocalStrategy({
			usernameField:'user',
			passwordField:'password',
			passReqToCallback:true
		}, function(req, user, password, done) {
			User.findById(user, function(err, user) {
				// if there is an error, stop everything and return that
	        	// ie an error connecting to the database
				if (err) {
					done(err);
				}

				if (!user) {
					return done("Incorrect user");
				} else {
					return done(null, user);
				}
			});
		}
	));


	//--------------------------------
	// 		FACEBOOK LOGIN
	//--------------------------------
	// passport.use(new FacebookStrategy({
	// 		clientID: '807681765941199', // FACEBOOK_APP_ID
	// 	    clientSecret: 'c64ee574724f64f077c12e28f1270267', // FACEBOOK_APP_SECRET
	// 	    passReqToCallback : true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	// 		profileFields: ['emails', 'photos', 'name']
	// 	}, function(req, token, refreshToken, profile, done) {
	// 		// find the user in the database based on their email and eventId
	// 		User.findById(profile.emails[0].value, function(err, user){
	// 			if (err) {
	// 				return done(err);
	// 			}

	// 			if (user){
	// 				done(null, user)
	// 			} else{
	// 				var newUser = new User({
	// 					_id:profile.emails[0].value,
	// 					password:"1",
	// 					firstName:profile.name.givenName,
	// 					lastName:profile.name.familyName,
	// 					profile:"user",
	// 					picture:profile.photos[0].value,
	// 					groups:[],
	// 					docs:[],
	// 					schools:[]
	// 				});

	// 				newUser.save(function(err) {
	// 					if(err){
	// 						return done(err);
	// 					}

	// 					return done(null, newUser);
	// 				})
	// 			}
	// 		});


	// 	}
	// ));

	// //--------------------------------
	// // 		GOOGLE LOGIN
	// //--------------------------------
	// passport.use(new GoogleStrategy({
	// 		clientID: '562883979046-edl2mbj93fvnb8os4jqqckndbs8470hs.apps.googleusercontent.com', // GOOGLE_APP_ID
	// 	    clientSecret: 'wEHJMHPUN-eb24u9pYRI_R8N', // GOOGLE_APP_SECRET
	// 	    callbackURL: '/auth/google/login_callback',
	// 	    passReqToCallback : true
	// 	}, function(req, token, refreshToken, profile, done) {
	// 		Player.findOne({'eventId': req.session.gameParams.eventId, 'socialConn.googleId': profile.id}, function(err, player) {
	// 			// if there is an error, stop everything and return that
	//         	// ie an error connecting to the database
	//             if (err) {
	//                 return done(err);
	//             }

	//             req.session.socialConn = {googleId: profile.id};

	// 			// if the user is found, then log them in
	//             if (player) {
	//                 return done(null, player);
	//             } else {
	//                 // if there is no user found with that id, create them
	//                 var newPlayer =
	//                 	new Player({eventId: req.session.gameParams.eventId,
	//                 			  picture: profile._json.picture,
	//                 			  socialConn: {googleId: profile.id},
	//                 			  leadFormEntries:[{name: "First Name", value: profile.name.givenName},
	//                 			  				   {name: "Last Name", value: profile.name.familyName},
	//                 			  				   {name: "Email", value: profile.emails[0].value}]});

	// 				// save our user to the database
	//                 newPlayer.save(function(err) {
	//                     if (err) {
	//                         throw err;
	//                     }

	//                     // if successful, return the new user
	//                     return done(null, newPlayer);
	//                 });
	//             }
	// 		});
	// 	}
	// ));
};