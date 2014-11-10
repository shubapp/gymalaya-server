'use strict';
var gymalaya = angular.module('gymalaya',['gymalaya.controllers','gymalaya.directives','ngRoute','gymalaya.resources','gymalaya.services','gymalaya.filters']);

// Routes section
gymalaya.config(function ($routeProvider, $locationProvider) {
	$routeProvider
	.when('/',{
		controller:'loginCtrl',
		templateUrl: 'views/login.html'
	})
	.when('/personal',{
		controller:'introCtrl',
		resolve:{
			loginResolver:loggedin
		},
		templateUrl: 'views/user.html'
	})
	.when('/muscles',{
		controller:'introCtrl',
		resolve:{
			loginResolver:loggedin
		},
		templateUrl: 'views/user.html'
	})
	.when('/exercise',{
		controller:'introCtrl',
		resolve:{
			loginResolver:loggedin
		},
		templateUrl: 'views/user.html'
	})
	.otherwise({redirectTo:'/personal'});

	$locationProvider.html5Mode(true);
});

gymalaya.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}]);


// Resolve's section
var loggedin = function($rootScope, $location, $q, General) {
	var username;
	var deferred = $q.defer();

	if (!$rootScope.user){
		username = localStorage.getItem("username");
	}else {
		username = $rootScope.user._id
	}

	if (!username){
		$location.path("/");
		deferred.reject();
	}else{
		General.loggedIn(username,function(verified){
			if (!verified){
				$location.path("/");
				deferred.reject();
			}else{
				deferred.resolve();
			}
		});
	}
	return deferred.promise;
};