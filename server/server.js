var cluster = require('cluster');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var multer  = require('multer')
var passport = require('passport');
var app = express();
var server = require('http').Server(app);

var workers = [];
var PORT = 8002;
var serverName = "gymalaya.shubapp.com";
//var serverName = "lcalhost"+port;

function initConfig(){
	process.on('uncaughtException',function(err){
		console.error("ERROR: " +err);
	});

	
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(allowCrossDomain);
	app.use(multer({ 
		dest: './server/uploads/'
	}));
	app.use(express.static(__dirname + "/../../gymalaya-app/gymalaya/www"));
	app.use(cookieParser());
	app.use(cookieSession({secret:'TeachersSecret!'}));
	app.use(passport.initialize());
	app.use(passport.session());

	require('./config/passport')(passport);
	require('./config/routes')(app, passport);
	require('./config/dbcon.js')();

	server.listen(process.env.clusterPort);

	console.log('Server running, listening on port', process.env.clusterPort);
}

function allowCrossDomain(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
};


// Code to run in the master process
if (cluster.isMaster) {
	// Count the machine's CPUs
    var cpuCount = 1; //require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        var worker = cluster.fork({clusterPort: PORT+i});

		// Add the worker to an array of known workers
    	workers.push(worker);
    }

	// Listen for dying workers
	cluster.on('exit', function (worker) {
	    console.log('Worker ' + worker.id + ' died.');

		// Remove the dead worker from the known workers array
	    // removeDeadWorkerFromArray(worker.id);

	    // Replace the dead worker
	    var worker = cluster.fork();

		// Add the worker to an array of known workers
    	workers.push(worker);
	});
// Code to run in a worker process
}else{
	initConfig();
}