'use strict';

var SAVE_USER_URL = 'https://appcarsharing-api.herokuapp.com/rest/user';

// var CARS_BY_USER = 'http://localhost:8080/appcarsharing-api/rest/user/cars';

// var AVAILABLE_BRANDS ='http://localhost:8080/appcarsharing-api/rest/brand';

// var USER = 'http://localhost:8080/appcarsharing-api/rest/user';

var userEmail = '';

var appCarSharingAppModule = angular.module('appCarSharingApp');

/**
 * @ngdoc function
 * @name appCarSharingApp.controller:SignUpCtrl
 * @description
 * # SignUpCtrl
 * Controller of the appCarSharingApp
 */
appCarSharingAppModule.controller('SignUpCtrl', function ($scope, $http, saveUserWebService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    var errorMessage = '';

    $scope.signUp = function signUp() {

    	if(isEmpty($scope.firstName) || isEmpty($scope.lastName) 
    		|| isEmpty($scope.password) || isEmpty($scope.birthDate)){

			errorMessage = 'Los siguientes campos son obligatorios:\n\n-Nombres.\n-Apellidos.\n-Correo Electrónico.\n-Contraseña.\n-Fecha de Nacimiento.\n';
			alert(errorMessage);
		}else{
			if(isEmpty($scope.email)){
				errorMessage = 'Debe Ingresar un correo electrónico válido.\n';
				alert(errorMessage);
	    	}else{
				var newUser = {
				  	birthDate: $scope.birthDate,
					email: $scope.email,
					lastName: $scope.lastName,
					name: $scope.firstName,
					password: $scope.password
				}
				saveUserWebService.saveUser(newUser).success(
											function(data, status){
												if(status == 200){
													alert('El usuario ha sido guardado exitosamente.');
												}else{
													alert('No ha sido posible guardar el usuario.');
												}
											});
		    }
    	}			
	};
	
	function clearData(){
		  $scope.firstName='';
		  $scope.lastName=''; 
		  $scope.email=''; 
		  $scope.password=''; 
		  $scope.birthDate=''; 
	}

	function isEmpty(string){
		if (string == undefined || string == '') {
			return true;
		}else{
			false;
		}
	}
  });

appCarSharingAppModule.service('saveUserWebService', function($http) {
	this.saveUser = function(newUser) {
		return ($http({
			method : 'POST',
			url : SAVE_USER_URL,
			data : newUser
		}));
	};
});