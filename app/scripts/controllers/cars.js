'use strict';

var AVAILABLE_BRANDS = 'http://appcarsharing-api.heroku.com/rest/brand';

var CARS_BY_USER = 'http://appcarsharing-api.heroku.com/rest/user/cars';

var USER = 'http://appcarsharing-api.heroku.com/rest/user';

var userEmail = 'luismi@gmail.com';
/**
 * @ngdoc function
 * @name appCarSharingApp.controller:CarlistCtrl
 * @description
 * # CarlistCtrl
 * Controller of the appCarSharingApp
 */
var appCarSharingAppModule = angular.module('appCarSharingApp');

appCarSharingAppModule.controller('CarlistCtrl', function ($scope, carsByUserWebService, availableBrandsWebService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    carsByUserWebService.findCarsByUser().success(function(data){
    	$scope.carlist = data;
    });

	availableBrandsWebService.findAllAvailableBrands().success(function(data){
    	$scope.brandlist = data;
    });

 	$scope.addCar = function addCar() {
	    	var newCar = {
	            carriagePlate: $scope.carriagePlate,
	            brand: {
	            	brand: $scope.brand
	            },
	            model: $scope.model,
	            color: $scope.color,
	            capacity: $scope.capacity
	        }



	    	if(newCar!=null){
		    	$scope.carlist.push(newCar);
		        clearData()
	    	}
	    };

	function clearData(){
		  $scope.name='';
		  $scope.memoryRAM=''; 
		  $scope.processor=''; 
		  $scope.internMemory=''; 
		  $scope.year=0; 
		  $scope.price=0;
	}
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
			withCredentials: true,
			method : 'GET',
			url : CARS_BY_USER + '/' + userEmail
		}));
	};
});

appCarSharingAppModule.service('addCarWebService', function($http) {
	this.addCar = function(carJSON) {

		return ($http({
			method : 'POST',
			url : CARS + '/' + userEmail,
			data : carJSON
		}));
	};
});
