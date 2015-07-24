'use strict';

/*var AVAILABLE_BRANDS = 'https://appcarsharing-api.herokuapp.com/rest/brand';
var CARS_BY_USER = 'https://appcarsharing-api.herokuapp.com/rest/user/cars';
var CARS = 'https://appcarsharing-api.herokuapp.com/rest/user';*/

var CARS_BY_USER = 'http://localhost:8080/appcarsharing-api/rest/user/cars';
var CARS = 'http://localhost:8080/appcarsharing-api/rest/user';
var AVAILABLE_BRANDS ='http://localhost:8080/appcarsharing-api/rest/brand';

var userEmail = 'luismi@gmail.com';


	
var appCarSharingModule = angular.module('appCarSharingApp');

appCarSharingModule
		.controller(
				'CarlistCtrl',
				function($scope, carsByUserWebService,
						availableBrandsWebService, addCarWebService) {
					$scope.awesomeThings = [ 'HTML5 Boilerplate', 'AngularJS' ];

					function clearData(){
						$scope.carriagePlate = '';
						$scope.brand = undefined;
						$scope.model = '';
						$scope.color = '';
						$scope.capacity = 0;
					}

					carsByUserWebService.findCarsByUser().success(
							function(data) {
								$scope.carlistByUser = data;
							});

					availableBrandsWebService.findAllAvailableBrands().success(
							function(data) {
								$scope.brandlist = data;
							});

					$scope.addCar = function addCar() {
						if ($scope.carriagePlate == undefined
								|| $scope.carriagePlate == ''
								|| $scope.brand == undefined
								|| $scope.brand == ''
								|| $scope.model == undefined
								|| $scope.model == ''
								|| $scope.capacity == undefined
								|| $scope.capacity == '') {
							alert("Por favor ingrese todos los datos obligatorios y correctamente.");

							return;
						}

						if (isNaN(parseInt($scope.capacity)
								|| isFinite($scope.capacity))) {
							alert("La capacidad debe ser un valor numérico.");

							return;
						}

						if ($scope.capacity <= 0) {
							alert("La capacidad debe ser mayor que cero.");

							return;
						}

						var newCar = {
							carriagePlate : $scope.carriagePlate,
							brand : {
								brand : $scope.brand
							},
							model : $scope.model,
							color : $scope.color,
							capacity : $scope.capacity
						}

						if (newCar != null) {
							addCarWebService.addCar(newCar).success(
								function(data, status) {
									if(status == 200){
										$scope.carlistByUser = data.cars;
										alert("Se ha agregado un nuevo carro satisfactoriamente.");
										clearData();
									} else {
										alert("Se ha producido un error, por favor contactese con el administrador.");
									}
								});
						}
					};
				});

appCarSharingModule.service('availableBrandsWebService', function($http) {
	this.findAllAvailableBrands = function() {

		return ($http({
			withCredentials : false,
			method : 'GET',
			url : AVAILABLE_BRANDS
		}));
	};
});

appCarSharingModule.service('carsByUserWebService', function($http) {
	this.findCarsByUser = function() {
		return ($http({
			withCredentials : false,
			method : 'GET',
			url : CARS_BY_USER + '/' + userEmail
		}));
	};
});

appCarSharingModule.service('addCarWebService', function($http) {
	this.addCar = function(carJSON) {

		return ($http({
			method : 'PUT',
			url : CARS + '/' + userEmail,
			data : carJSON
		}));
	};
});
