var gymalaya = angular.module('gymalaya.services', []);

gymalaya.factory("General", function($http, $rootScope) {
	return {
		loggedIn: function(username, cb){
			if(!username){
				if (cb){
					cb(false);
					return false;
				}
			}
			
			$http.post('/auth/userlogin',{user:username,password:"1"})
			.success(function(data) {
				if (data && !data.error){
					$rootScope.user = data;
					localStorage.setItem("username", username);
		
					if (cb){
						cb(true);
					}
				}else{
					if (cb){
						cb(false);
					}
				}

			}).error(function(data, status, headers, config) {
				if (cb){
					cb(false);
				}
			});
		}
	};
});