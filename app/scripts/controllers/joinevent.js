'use strict';

 var AVAILABLE_EVENTS = 'https://appcarsharing-api.herokuapp.com/rest/event/all';
 var AVAILABLE_USERS = 'https://appcarsharing-api.herokuapp.com/rest/user';
 var JOIN_EVENT = 'https://appcarsharing-api.herokuapp.com/rest/event/partner/';

//var AVAILABLE_EVENTS = 'http://localhost:8080/appcarsharing-api/rest/event/all';
//var AVAILABLE_USERS = 'http://localhost:8080/appcarsharing-api/rest/user';
//var JOIN_EVENT = 'http://localhost:8080/appcarsharing-api/rest/event/partner/';

var appCarSharingModule = angular.module('appCarSharingApp');

appCarSharingModule
    .controller(
        'JoinEventCtrl',
        function($scope, getAvailableEventsWebService,
            getAvailableUsersWebService, joinEventWebService) {
            $scope.awesomeThings = ['HTML5 Boilerplate', 'AngularJS'];

            getAvailableEventsWebService
                .getAvailableEvents()
                .success(
                    function(data, status) {
                        if (status !== 200) {
                            alert("Se ha producido un error. Por favor cantáctese con el administrador o inténtelo de nuevo.");

                            return;
                        }

                        $scope.events = data;
                        var n = $scope.events.length;
                        var r = Math
                            .floor((Math.random() * n) + 1);

                        $scope.event = $scope.events[r - 1];
                        var time = new Date(
                            $scope.event.eventDate);

                        var day = time.getDate();
                        if (day < 10) {
                            day = "0" + day;
                        }

                        var month = time.getMonth() + 1;
                        if (month < 10) {
                            month = "0" + month;
                        }

                        var hours = time.getHours();
                        var timemeridian = "AM";
                        if (hours > 12) {
                            hours -= 12;
                            timemeridian = "PM";
                        }

                        if (hours === 12) {
                            timemeridian = "PM";
                        }

                        var minutes = time.getMinutes();

                        $scope.eventDate = "" + day + "/" + month + "/" + time.getFullYear() + " - " + hours + ":" + minutes + " " + timemeridian;

                        $scope.source = $scope.event.source;
                        $scope.target = $scope.event.target;

                        $scope.showMarkers();

                    });

            getAvailableUsersWebService
                .getAvailableUsers()
                .success(
                    function(data, status) {
                        if (status !== 200) {
                            alert("Se ha producido un error. Por favor cantáctese con el administrador o inténtelo de nuevo.");

                            return;
                        }

                        $scope.users = data;
                        var n = $scope.users.length;
                        var r = Math
                            .floor((Math.random() * n) + 1);

                        $scope.user = $scope.users[r - 1];

                    });

            $scope.join = function() {
                if ($scope.event.author.email === $scope.user.email) {
                    alert("El usuario que se está tratando de unir al evento es el creador del mismo.");

                    return;
                }

                var userJoin = {
                    name: $scope.user.name,
                    lastName: $scope.user.lastName,
                    email: $scope.user.email
                };

                joinEventWebService
                    .joinEvent(userJoin, $scope.event.id)
                    .success(
                        function(data, status) {
                            if (status === 204) {

                                alert("El usuario ya se unió al evento previamente.");
                            } else if (status === 200) {
                                if (data.messageResponse !== undefined) {
                                    alert(data.messageResponse);

                                    return;
                                }

                                alert("El usuario se unió satisfactoriamente al evento.");

                                $scope.event = data;

                                var time = new Date(
                                    $scope.event.eventDate);

                                var day = time.getDate();
                                if (day < 10) {
                                    day = "0" + day;
                                }

                                var month = time.getMonth() + 1;
                                if (month < 10) {
                                    month = "0" + month;
                                }

                                var hours = time.getHours();
                                var timemeridian = "AM";
                                if (hours > 12) {
                                    hours -= 12;
                                    timemeridian = "PM";
                                }

                                if (hours === 12) {
                                    timemeridian = "PM";
                                }

                                var minutes = time.getMinutes();

                                $scope.eventDate = "" + day + "/" + month + "/" + time.getFullYear() + " - " + hours + ":" + minutes + " " + timemeridian;

                                $scope.source = $scope.event.source;
                                $scope.target = $scope.event.target;

                                $scope.showMarkers();
                            } else {

                                alert("Se ha producido un error. Por favor comuníquese con el administrador.");
                            }

                        });
            }

            $scope.showMarkers = function() {
                if ($scope.source == undefined || $scope.source == null || $scope.target == undefined || $scope.source == null) {
                    alert("No se encontró la dirección de origen o destino. Por favor contáctese con el administrador.");
                }

                $scope.mapOptions.zoom = 14;
                $scope.map = new google.maps.Map(document
                    .getElementById('map'), $scope.mapOptions);
                $scope.markers = [];

                var temp = $scope.source.description.split(",")[0];
                var s = {
                    lat: $scope.source.latitude,
                    lng: $scope.source.longitude,
                    title: temp,
                    desc: $scope.source.description
                };
                $scope.createMarker(s);

                temp = ($scope.target.description.split(","))[0];
                var t = {
                    lat: $scope.target.latitude,
                    lng: $scope.target.longitude,
                    title: temp,
                    desc: $scope.target.description
                };
                $scope.createMarker(t);
            };

            // Google Maps
            $scope.mapOptions = {
                zoom: 16,
                center: new google.maps.LatLng(6.253040800000001, -75.5645737),
                mapTypeId: google.maps.MapTypeId.TERRAIN
            };

            $scope.map = new google.maps.Map(document
                .getElementById('map'), $scope.mapOptions);
            $scope.markers = [];

            var infoWindow = new google.maps.InfoWindow();

            $scope.createMarker = function(info) {
                $scope.painted = true;

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(info.lat,
                        info.lng),
                    title: info.title
                });

                marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

                google.maps.event.addListener(marker, 'click',
                    function() {
                        infoWindow.setContent('<h3>' + marker.title + '</h3>' + marker.content);
                        infoWindow.open($scope.map, marker);
                    });
                $scope.markers.push(marker);

            };

            $scope.openInfoWindow = function(e, selectedMarker) {
                e.preventDefault();
                google.maps.event.trigger(selectedMarker, 'click');
            };

        });

appCarSharingModule.service('googleMapsWebService', function($http) {
    this.getCoordinates = function(address) {

        return ($http({
            method: 'GET',
            url: GOOGLE_MAPS_SERVICE + address + ',' + Medellin + ',' + Antioquia + ',' + Colombia + GOOGLE_MAPS_SENSOR
        }));
    };
});

appCarSharingModule.service('joinEventWebService', function($http) {
    this.joinEvent = function(userJSON, eventId) {

        return ($http({
            withCredentials: false,
            method: 'PUT',
            url: JOIN_EVENT + eventId,
            data: userJSON
        }));
    };
});

appCarSharingModule.service('getAvailableEventsWebService', function($http) {
    this.getAvailableEvents = function() {
        return ($http({
            withCredentials: false,
            method: 'GET',
            url: AVAILABLE_EVENTS
        }));
    };
});

appCarSharingModule.service('getAvailableUsersWebService', function($http) {
    this.getAvailableUsers = function() {
        return ($http({
            withCredentials: false,
            method: 'GET',
            url: AVAILABLE_USERS
        }));
    };
});