'use strict';

var AVAILABLE_BRANDS = 'http://appcarsharing-api.heroku.com/rest/brand';

var CARS_BY_USER = 'http://appcarsharing-api.heroku.com/rest/user/cars';

var USER = 'http://appcarsharing-api.heroku.com/rest/user';

/**
 * @ngdoc function
 * @name appCarSharingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appCarSharingApp
 */
var appCarSharingAppModule = angular.module('appCarSharingApp');

appCarSharingAppModule.controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

appCarSharingAppModule.service('availableBrandsWebService', function($http) {
	this.findAllAvailableBrands = function() {

		return ($http({
			method : 'GET',
			url : AVAILABLE_BRANDS
		}));
	};
});

appCarSharingAppModule.service('carsByUserWebService', function($http) {
	this.findAllAvailableBrands = function($cookies) {

		return ($http({
			method : 'GET',
			url : CARS_BY_USER,
			params : {
				email : $cookies.email;
			}
		}));
	};
});

appCarSharingAppModule.service('addCarWebService', function($http) {
	this.findAllAvailableBrand = function(carJSON, $cookies) {

		return ($http({
			method : 'POST',
			url : CARS,
			params : {
				email : $cookies.email;
			},
			data : carJSON
		}));
	};
});
