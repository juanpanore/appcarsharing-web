'use strict';

var AVAILABLE_BRANDS = 'https://appcarsharing-api.herokuapp.com/rest/brand';

var CARS_BY_USER = 'https://appcarsharing-api.herokuapp.com/rest/user/cars';

var USER = 'https://appcarsharing-api.herokuapp.com/rest/user';

// var CARS_BY_USER = 'http://localhost:8080/appcarsharing-api/rest/user/cars';

// var AVAILABLE_BRANDS ='http://localhost:8080/appcarsharing-api/rest/brand';

// var USER = 'http://localhost:8080/appcarsharing-api/rest/user';

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
	this.findCarsByUser = function() {

		return ($http({
			method : 'GET',
			url : CARS_BY_USER,
			params : {
				email : userEmail
			}
		}));
	};
});

appCarSharingAppModule.service('addCarWebService', function($http) {
	this.addCar = function(carJSON) {

		return ($http({
			method : 'POST',
			url : CARS,
			params : {
				email : userEmail
			},
			data : carJSON
		}));
	};
});
