'use strict';
var gymalaya = angular.module('gymalaya.controllers',['gymalaya.services','gymalaya.resources']);

var controllers={};

controllers.loginCtrl = function ($scope, $rootScope, $http, $location, General){
	$scope.login = function(username, pass){
		if (!pass){
			General.loggedIn(username,function(verified){
				if (verified){
					$location.path('/personal');
				}else{
					$scope.errorMessage="User not found";
				}
			});
		}else{
			$scope.errorMessage="User not found";
		}
	};
};

controllers.introCtrl = function ($scope, $location, $rootScope, $http, $timeout, General, loginResolver) {
	$scope.route = $location.path();

	$scope.logout = function(){
		$http.get("/logout");
		$rootScope.user = null;
		localStorage.setItem("username", null);
		$location.path("/");
	};

	$scope.addTotalGraph = function(data){
		$("#totalGraph").highcharts({
	        chart: {
	            zoomType: 'x'
	        },
	        title: {
	            text: $rootScope.user.firstName + " " + $rootScope.user.lastName
	        },
	        subtitle: {
	            text: document.ontouchstart === undefined ?
	                    'Personal Gym Sammery' :
	                    'Pinch the chart to zoom in'
	        },
	        xAxis: {
	            type: 'datetime',
	            minRange: 14 * 24 * 3600000 // fourteen days
	        },
	        yAxis: {
	            title: {
	                text: 'Strength'
	            }
	        },
	        legend: {
	            enabled: false
	        },
	        plotOptions: {
	            area: {
	                fillColor: {
	                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
	                    stops: [
	                        [0, Highcharts.getOptions().colors[0]],
	                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
	                    ]
	                },
	                marker: {
	                    radius: 2
	                },
	                lineWidth: 1,
	                states: {
	                    hover: {
	                        lineWidth: 1
	                    }
	                },
	                threshold: null
	            }
	        },

	        series: [{
	            type: 'area',
	            name: 'Avarage strength',
	            pointInterval: 24 * 3600 * 1000,
	            pointStart: Date.UTC(2006, 0, 1),
	            data: data
	        }]
	    });
	};

	$scope.initData = function(){
		$http.get('/api/exercises'
		).success(function(data) {
			console.log(data);
			$scope.exercises = data;
		}).error(function(data, status, headers, config) {
			console.log(data);
		});

		$http.get('/indicators'
		).success(function(data) {
			console.log(data);
			$scope.indicators = data;
			$scope.addWeightGraph($scope.indicators);
		}).error(function(data, status, headers, config) {
			console.log(data);
		});

		$http.get('/api/totalWorkout'
		).success(function(data) {
			var strengths=[];
			var dates = [];
			for (var i = 0; i < data.length; i++) {
				dates.push(data[i].date);
				strengths.push(data[i].strength);
			}
			$scope.addTotalGraph(strengths);
		}).error(function(data, status, headers, config) {
			console.log(data);
		});

	};

	$scope.tabSwitch = function(newpath){
		$scope.route = newpath;
		$location.path(newpath, false);
		if (newpath=='/personal'){
			$timeout(function(){
				$scope.addWeightGraph($scope.indicators);
			});
		}else if (newpath=='/muscles'){
			$scope.addMuscleGraph($scope.choosenMgroup);
		}
	};

	$scope.addWeightGraph = function(indicators){
		var weights=[];
		var dates = [];
		for (var i = 0; i < indicators.length; i++) {
			dates.push(indicators[i].date);
			weights.push(indicators[i].weight);
		}
		
		$('#weightGraph').highcharts({
	        chart: {
	            type: 'line'
	        },
	        title: {
	            text: $rootScope.user.firstName + " " + $rootScope.user.lastName
	        },
	        subtitle: {
	            text: 'Weight Timeline'
	        },
	        xAxis: {
	            categories: dates
	        },
	        yAxis: {
	            title: {
	                text: 'Weight'
	            }
	        },
	        plotOptions: {
	            series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (e) {
                            	console.log(e);
                            	/*
                                hs.htmlExpand(null, {
                                    pageOrigin: {
                                        x: e.pageX || e.clientX,
                                        y: e.pageY || e.clientY
                                    },
                                    headingText: this.series.name,
                                    maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
                                        this.y + ' visits',
                                    width: 200
                                });*/
                            }
                        }
                    },
                    marker: {
                        lineWidth: 1
                    }
                }
	        },
	        series: [{
	            name: $rootScope.user.firstName + " " + $rootScope.user.lastName,
	            data: weights
	        }]
	    });
	};

	$scope.addMuscleGraph = function(mgroup){
		$scope.choosenMgroup = mgroup;
		$http.get('/api/mgroup/' + mgroup
		).success(function(exercises) {
			var data = [];
			for (var i = 0; i < exercises.length; i++) {
				data.push(exercises[i].strength);
			}

			$scope.addRm1Graph('#muscleGraph', "Muscle Graph", mgroup, [{name:mgroup,data:data}]);
		}).error(function(data, status, headers, config) {
			console.log(data);
		});
	};

	$scope.addRm1Graph = function(id, graphTitle, graphSubtitle, series){
		$(id).highcharts({
	        chart: {
	            type: 'spline'
	        },
	        title: {
	            text: graphTitle
	        },
	        subtitle: {
	            text: graphSubtitle
	        },
	        xAxis: {
	            type: 'datetime',
	            labels: {
	                overflow: 'justify'
	            }
	        },
	        yAxis: {
	            title: {
	                text: 'RM1 (Strength)'
	            },
	            min: 0,
	            minorGridLineWidth: 0,
	            gridLineWidth: 0,
	            alternateGridColor: null,
	            // plotBands: [{ // Light air
	            //     from: 0.3,
	            //     to: 1.5,
	            //     color: 'rgba(68, 170, 213, 0.1)',
	            //     label: {
	            //         // text: 'Light air',
	            //         style: {
	            //             color: '#606060'
	            //         }
	            //     }
	            // }, { // Light breeze
	            //     from: 1.5,
	            //     to: 3.3,
	            //     color: 'rgba(0, 0, 0, 0)',
	            //     label: {
	            //         // text: 'Light breeze',
	            //         style: {
	            //             color: '#606060'
	            //         }
	            //     }
	            // }, { // Gentle breeze
	            //     from: 3.3,
	            //     to: 5.5,
	            //     color: 'rgba(68, 170, 213, 0.1)',
	            //     label: {
	            //         // text: 'Gentle breeze',
	            //         style: {
	            //             color: '#606060'
	            //         }
	            //     }
	            // }, { // Moderate breeze
	            //     from: 5.5,
	            //     to: 8,
	            //     color: 'rgba(0, 0, 0, 0)',
	            //     label: {
	            //         // text: 'Moderate breeze',
	            //         style: {
	            //             color: '#606060'
	            //         }
	            //     }
	            // }, { // Fresh breeze
	            //     from: 8,
	            //     to: 11,
	            //     color: 'rgba(68, 170, 213, 0.1)',
	            //     label: {
	            //         // text: 'Fresh breeze',
	            //         style: {
	            //             color: '#606060'
	            //         }
	            //     }
	            // }, { // Strong breeze
	            //     from: 11,
	            //     to: 14,
	            //     color: 'rgba(0, 0, 0, 0)',
	            //     label: {
	            //         // text: 'Strong breeze',
	            //         style: {
	            //             color: '#606060'
	            //         }
	            //     }
	            // }, { // High wind
	            //     from: 14,
	            //     to: 15,
	            //     color: 'rgba(68, 170, 213, 0.1)',
	            //     label: {
	            //         // text: 'High wind',
	            //         style: {
	            //             color: '#606060'
	            //         }
	            //     }
	            // }]
	        },
	        tooltip: {
	            // valueSuffix: ' m/s'
	        },
	        plotOptions: {
	            spline: {
	                lineWidth: 4,
	                states: {
	                    hover: {
	                        lineWidth: 5
	                    }
	                },
	                marker: {
	                    enabled: false
	                },
	                pointInterval: 3600000, // one hour
	                pointStart: Date.UTC(2009, 9, 6, 0, 0, 0)
	            }
	        },
	        series: series,
	        navigation: {
	            menuItemStyle: {
	                fontSize: '10px'
	            }
	        }
	    });
	};

	$scope.addExerciseGraph = function(choosenExercise){
		var name;
		if(choosenExercise){
			name = choosenExercise.name;
			$http.get('/api/exercise/' + name
			).success(function(exercises) {
				var data = [];
				for (var i = 0; i < exercises.length; i++) {
					data.push(exercises[i].strength);
				}

				$scope.addRm1Graph('#exerciseGraph', "Exercise Graph", name, [{name:name,data:data}]);
			}).error(function(data, status, headers, config) {
				console.log(data);
			});
		}else{
			name = "Exercise Name";
			$scope.addRm1Graph('#exerciseGraph', "Exercise Graph", name, [{name:name,data:[]}]);
		}

	};
};


gymalaya.controller(controllers);