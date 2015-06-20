'use strict';

var USER = 'https://appcarsharing-api.herokuapp.com/rest/user';

// var CARS_BY_USER = 'http://localhost:8080/appcarsharing-api/rest/user/cars';

// var AVAILABLE_BRANDS ='http://localhost:8080/appcarsharing-api/rest/brand';

// var USER = 'http://localhost:8080/appcarsharing-api/rest/user';

var userEmail = '';

/**
 * @ngdoc function
 * @name appCarSharingApp.controller:SingUpCtrl
 * @description
 * # SingUpCtrl
 * Controller of the appCarSharingApp
 */
var appCarSharingAppModule = angular.module('appCarSharingApp');

appCarSharingAppModule.controller('SingUpCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
 
  });