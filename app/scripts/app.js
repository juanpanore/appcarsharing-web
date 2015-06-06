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
    'ngCookies',
    'ui.bootstrap'
  ]);

appCarSharingAppModule.factory('defaultInformation',
		function($cookies, $location) {

			return ({
				setDefultInfo : function() {
					$cookies.email = 'luismi@gmail.com';
				}
			});
		});

appCarSharingAppModule.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

appCarSharingAppModule.run(function($rootScope, defaultInformation) {
	$rootScope.$on('$routeChangeStart', function() {
		defaultInformation.setDefultInfo();
	});
});
