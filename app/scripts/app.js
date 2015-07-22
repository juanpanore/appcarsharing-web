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
        'ui.bootstrap',
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ngCookies',
        'ng-bootstrap-datepicker'
    ]);

appCarSharingAppModule.factory('defaultInformation',
    function($cookies, $location) {

        return ({
            setDefultInfo: function() {
                $cookies.email = 'luismi@gmail.com';
            }
        });
    });

appCarSharingAppModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider

        .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
        })
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .when('/cars', {
            templateUrl: 'views/carlist.html',
            controller: 'CarlistCtrl'
        })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'SignUpCtrl'
        }).when('/eventcreation', {
            templateUrl: 'views/eventcreation.html',
            controller: 'EventCreationCtrl'
        }).when('/joinevent', {
            templateUrl: 'views/joinevent.html',
            controller: 'JoinEventCtrl'
        }).otherwise({
            redirectTo: '/'
        });
}]);


// appCarSharingAppModule.run(function($rootScope, defaultInformation, $location) {
//  $rootScope.$on('$routeChangeStart', function() {
//    defaultInformation.setDefultInfo();
//     $location.url('/');
//  });
