'use strict';
var gymalaya = angular.module('gymalaya.resources', ['ngResource']);

var API_PATH = "/api";

gymalaya.factory("Category", ['$resource', function($resource) {
	return $resource(API_PATH + "/categories/:id", {id: "@id"});
}]);

gymalaya.factory("User", ['$resource', function($resource) {
	return $resource(API_PATH + "/users/:id", {id: "@id"});
}]);

gymalaya.factory("Comment", ['$resource', function($resource) {
	return $resource(API_PATH + "/comments/:id", {id: "@id"});
}]);

gymalaya.factory("Doc", ['$resource', function($resource) {
	return $resource(API_PATH + "/docs/:id", {id: "@id"});
}]);

gymalaya.factory("Group", ['$resource', function($resource) {
	return $resource(API_PATH + "/groups/:id", {id: "@id"});
}]);