'use strict';

/**
 * @ngdoc overview
 * @name appCarSharingApp
 * @description
 * # appCarSharingApp
 *
 * Main module of the application.
 */
var appCarSharingAppModule = angular
  .module('appCarSharingApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngCookies'
  ]);

appCarSharingAppModule.factory('defaultInformation',
		function($cookies, $location) {

			return ({
				setDefultInfo : function() {
					$cookies.email = 'luismi@gmail.com';
				}
			});
		});

appCarSharingAppModule.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/shared', {
        templateUrl: 'views/shared.html',
        controller: 'CarlistCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

// appCarSharingAppModule.run(function($rootScope, defaultInformation, $location) {
// 	$rootScope.$on('$routeChangeStart', function() {
// 		defaultInformation.setDefultInfo();
//     $location.url('/');
// 	});

