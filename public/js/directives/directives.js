'use strict';
var gymalaya = angular.module('gymalaya.directives',[]);
var directives = {};

directives.overall = function() {
	return {
		restrict: 'E',
		templateUrl:'views/overall.html',
        replace: true
	};
};

directives.gallery = function() {
	return {
		restrict: 'E',
		templateUrl:'views/gallery.html',
        replace: true
	};
};

directives.personal = function() {
	return {
		restrict: 'E',
		templateUrl:'views/personal.html',
        replace: true
	};
};

directives.exercise = function() {
	return {
		restrict: 'E',
		templateUrl:'views/exercise.html',
        replace: true
	};
};

directives.muscles = function() {
	return {
		restrict: 'E',
		templateUrl:'views/muscles.html',
        replace: true
	};
};

gymalaya.directive(directives);