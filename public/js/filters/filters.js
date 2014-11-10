'use strict';
var gymalaya = angular.module('gymalaya.filters',[]);
var filters = {};

filters.mailToUser = function(){
	return function(input) {
		if (input && input.indexOf('@')!=-1)
			return input.substring(0,input.indexOf('@'));
		return input;
	};
};

filters.avatarImg = function(){
	return function(input) {
		if (!input)
			input = 'img/anonymous.png'
		return input;
	};
};

gymalaya.filter(filters);