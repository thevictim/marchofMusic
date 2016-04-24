
'use strict';

    var myapp = angular.module('trashApp', [
  'angular-timeline', 'ngRoute','ngSanitize',
  'ui.router',
	'angular-scroll-animate']);


    myapp.config(function($stateProvider) {
  $stateProvider.state('user', {
    url:         '',
    controller: 'ExampleCtrl',
    templateUrl: 'example.html'
  });
});










