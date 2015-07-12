'use strict';

 var CARS_BY_USER = 'https://appcarsharing-api.herokuapp.com/rest/user/cars';
 var EVENT_CREATION = 'https://appcarsharing-api.herokuapp.com/rest/event';

//var CARS_BY_USER = 'http://localhost:8080/appcarsharing-api/rest/user/cars';
//var EVENT_CREATION = 'http://localhost:8080/appcarsharing-api/rest/event';

var GOOGLE_MAPS_SERVICE = 'https://maps.google.com/maps/api/geocode/json?address=';
var GOOGLE_MAPS_SENSOR = '&sensor=false;';

var Medellin = '+Medellin';
var Antioquia = '+Antioquia';
var Colombia = "+Colombia";

var userEmail = 'luismi@gmail.com';
var lastName = 'Ruiz';
var name = 'Luismi';

var appCarSharingModule = angular.module('appCarSharingApp');

var address = [];

appCarSharingModule
    .controller(
        'EventCreationCtrl',
        function($scope, carsByUserWebService, googleMapsWebService,
            createEventWebService) {
            $scope.awesomeThings = ['HTML5 Boilerplate', 'AngularJS'];

            $(function() {
                $('#sandbox-container .input-group.date').datepicker({
                    format: "dd/mm/yyyy",
                    clearBtn: true,
                    language: "es",
                    autoclose: true,
                    todayHighlight: true,
                    toggleActive: true
                });
            });

            $scope.painted = false;
            $scope.time = new Date();

            $scope.hstep = 1;
            $scope.mstep = 1;

            $scope.ismeridian = true;
            $scope.toggleMode = function() {
                $scope.ismeridian = !$scope.ismeridian;
            };

            $scope.update = function() {
                var d = new Date();
                d.setHours(14);
                d.setMinutes(0);
                $scope.time = d;
            };

            $scope.clear = function() {
                $scope.time = new Date();
                $scope.car = undefined;
                $scope.source = '';
                $scope.sourceGeometry = undefined;
                $scope.target = '';
                $scope.targetGeometry = undefined;
                $scope.price = '';
                $scope.eventDate = undefined;
                $scope.painted = false;
                $scope.mapOptions.zoom = 16;
                $scope.map = new google.maps.Map(document
                    .getElementById('map'), $scope.mapOptions);
                address = [];
                $scope.markers = [];
            };

            carsByUserWebService.findCarsByUser().success(
                function(data) {
                    $scope.carList = data;
                });

            $scope.createEvent = function() {
                var errorMessage = $scope.validateRequired();

                if (errorMessage !== '') {
                    alert("Los siguientes campos son obligatorios:\n" + errorMessage);

                    return;
                }

                if ($scope.target === $scope.source) {
                    alert("Por favor ingrese las dos direcciones diferentes.");

                    return;
                }

                if (!$scope.painted) {
                    alert("Por favor pinte las direcciones antes de crear el evento.");

                    return;
                }

                var eventDateArray = $scope.eventDate.split("/");
                var eventDay = eventDateArray[0];
                var eventMonth = parseInt(eventDateArray[1]);
                eventMonth -= 1;
                var eventYear = eventDateArray[2];
                var eventHours = $scope.time.getHours();
                var eventMinutes = $scope.time.getMinutes();
                var eventTime = new Date(eventYear, eventMonth,
                    eventDay, eventHours, eventMinutes, 0, 0);
                var actualTime = new Date();

                if (Date.parse(eventTime.toString()) < Date
                    .parse(actualTime.toString())) {
                    alert("Por favor ingrese una hora y/o fecha posterior a la actual.");

                    return;
                }

                if ($scope.price < 500) {
                    alert("Recuerde que el valor mínimo para un viaje es $500.");

                    return;
                }

                if ($scope.sourceGeometry === undefined || $scope.sourceGeometry === null || $scope.sourceGeometry.desc === undefined || $scope.sourceGeometry.desc === '' || $scope.sourceGeometry.lat === undefined || $scope.sourceGeometry.lat === '' || $scope.sourceGeometry.lng === undefined || $scope.sourceGeometry.lng === '' || $scope.targetGeometry === undefined || $scope.targetGeometry === null || $scope.targetGeometry.desc === undefined || $scope.targetGeometry.desc === '' || $scope.targetGeometry.lat === undefined || $scope.targetGeometry.lat === '' || $scope.targetGeometry.lng === undefined || $scope.targetGeometry.lng === '' || !$scope.painted) {

                    alert("Por favor pinte las direcciones en el mapa antes de crear el evento.");
                }

                var event = {
                    author: {
                        email: userEmail,
                        lastName: lastName,
                        name: name
                    },
                    car: $scope.car,
                    eventDate: Date.parse(eventTime),
                    createDate: Date.parse(new Date()),
                    source: {
                        latitude: $scope.sourceGeometry.lat,
                        longitude: $scope.sourceGeometry.lng,
                        description: $scope.sourceGeometry.desc
                    },
                    target: {
                        latitude: $scope.targetGeometry.lat,
                        longitude: $scope.targetGeometry.lng,
                        description: $scope.targetGeometry.desc
                    },
                    value: $scope.price
                };

                createEventWebService
                    .createEvent(event)
                    .success(
                        function(data, status) {
                            if (status === 200) {
                                $scope.clear();

                                alert("El evento ha sido creado satisfactoriamente.");
                            } else {
                                alert("Se ha producido un error al crear el evento.\n\nPor favor póngase en contacto con el administrador.");
                            }
                        });
            }

            $scope.removeTildes = function(text) {
                if (text == undefined || text == null) {
                    return null;
                }

                text = text.replace('á', 'a');
                text = text.replace('é', 'e');
                text = text.replace('í', 'i');
                text = text.replace('ó', 'o');
                text = text.replace('ú', 'u');

                text = text.replace('Á', 'A');
                text = text.replace('É', 'E');
                text = text.replace('Í', 'I');
                text = text.replace('Ó', 'O');
                text = text.replace('Ú', 'U');

                return text;
            }

            $scope.validateRequired = function() {
                var errorMessage = '';
                if ($scope.source == undefined || $scope.source.trim() == '') {
                    errorMessage += '- Dirección de origen\n';
                }

                if ($scope.target == undefined || $scope.target.trim() == '') {
                    errorMessage += '- Dirección de destino\n';
                }

                if ($scope.car == undefined || $scope.car == null) {
                    errorMessage += '- Carro\n';
                }

                if (isNaN($scope.price)) {
                    errorMessage += '- Precio\n';
                }

                if ($scope.eventDate == undefined || $scope.eventDate == null || $scope.eventDate.trim() === '') {
                    errorMessage += '- Fecha\n';
                }

                if ($scope.time == undefined || $scope.time == null) {
                    errorMessage += '- Hora';
                }

                return errorMessage;
            }

            $scope.showMarkers = function() {
                if ($scope.source == undefined || $scope.source == '' || $scope.target == undefined || $scope.source == '') {
                    alert("Por favor ingrese tanto la dirección de origen como la de destino");
                }

                if ($scope.source === $scope.target) {
                    alert("Por favor ingrese dos direcciones diferentes.");

                    return;
                }

                $scope.mapOptions.zoom = 14;
                $scope.map = new google.maps.Map(document
                    .getElementById('map'), $scope.mapOptions);
                address = [];
                $scope.markers = [];

                $scope.source = $scope.removeTildes($scope.source);
                $scope.target = $scope.removeTildes($scope.target);

                var s = $scope.source.replace('#', '%23');
                s = s.replace(/ /g, '+');
                googleMapsWebService
                    .getCoordinates(s)
                    .success(
                        function(data) {
                            if (data.status != "OK") {
                                alert("Por favor ingrese una dirección de origen correcta.");

                                return;
                            }

                            if (data.results[0].geometry.location != undefined && data.results[0].geometry.location != null && data.results[0].geometry.location != '') {
                                $scope.sourceGeometry = {
                                    lat: data.results[0].geometry.location.lat,
                                    lng: data.results[0].geometry.location.lng,
                                    desc: data.results[0].formatted_address
                                };

                                address[0] = {
                                    lat: $scope.sourceGeometry.lat,
                                    lng: $scope.sourceGeometry.lng,
                                    desc: $scope.sourceGeometry.desc,
                                    title: $scope.source
                                };

                                $scope.createMarker(address[0]);
                            }
                        });

                var t = $scope.target.replace('#', '%23');
                t = t.replace(/ /g, '+');
                googleMapsWebService
                    .getCoordinates(t)
                    .success(
                        function(data) {
                            if (data.status != "OK") {
                                alert("Por favor ingrese una dirección de destino correcta.");

                                return;
                            }

                            if (data.results[0].geometry.location != undefined && data.results[0].geometry.location != null && data.results[0].geometry.location != '') {
                                $scope.targetGeometry = {
                                    lat: data.results[0].geometry.location.lat,
                                    lng: data.results[0].geometry.location.lng,
                                    desc: data.results[0].formatted_address
                                };

                                address[1] = {
                                    lat: $scope.targetGeometry.lat,
                                    lng: $scope.targetGeometry.lng,
                                    desc: $scope.targetGeometry.desc,
                                    title: $scope.target
                                };

                                $scope.createMarker(address[1]);
                            }
                        });
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

appCarSharingModule.service('createEventWebService', function($http) {
    this.createEvent = function(eventJSON) {

        return ($http({
            withCredentials: false,
            method: 'POST',
            url: EVENT_CREATION,
            data: eventJSON
        }));
    };
});

appCarSharingModule.service('carsByUserWebService', function($http) {
    this.findCarsByUser = function() {
        return ($http({
            withCredentials: false,
            method: 'GET',
            url: CARS_BY_USER + '/' + userEmail
        }));
    };
});