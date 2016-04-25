
'use strict';

var myapp = angular.module('trashApp', [
  'angular-timeline', 'ngRoute','ngSanitize',
  'ui.router',
  'angular-scroll-animate'])
.config(function($stateProvider) {
  $stateProvider.state('user', {
    url:         '',
    controller: 'ExampleCtrl',
    templateUrl: 'example.html'
  });
}).service("Albums", function($http){
      this.sendSearch = function(artist) {
        console.log(artist);
        return $http.post("/sendArtist",{who: artist}).
        then(function(response) {
          return response;
        }, function(response) {
          console.log(response);
          alert("Error finding contacts.");
        });
  }


})
.controller('ExampleCtrl', function($scope, Albums) {
  var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. " +
  "Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor." +
  "Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, " +
  "ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor." +
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

  $scope.side = '';

  $scope.events = [{
    badgeClass: 'info',
    badgeIconClass: 'glyphicon-check',
    title: 'First heading',
    when: '11 hours ago via Twitter',
    content: 'Some awesome content.'
  }, {
    badgeClass: 'warning',
    badgeIconClass: 'glyphicon-credit-card',
    title: 'Second heading',
    when: '12 hours ago via Twitter',
    content: 'More awesome content.'
  }, {
    badgeClass: 'default',
    badgeIconClass: 'glyphicon-credit-card',
    title: 'Third heading',
    titleContentHtml: '<img class="img-responsive" src="http://www.freeimages.com/assets/183333/1833326510/wood-weel-1444183-m.jpg">',
    contentHtml: lorem,
    footerContentHtml: '<a href="">Continue Reading</a>'
  }];

  $scope.addEvent = function(artist, albumName, year, imageurl) {
    $scope.events.push({
      badgeClass: 'info',
      badgeIconClass: 'glyphicon-check',
      title: albumName,
      when: year,
      contentHtml:'<img class="img-responsive" src="'+imageurl+'">'
    });

  };
        // optional: not mandatory (uses angular-scroll-animate)
        $scope.animateElementIn = function($el) {
          $el.removeClass('timeline-hidden');
          $el.addClass('bounce-in');
        };

        // optional: not mandatory (uses angular-scroll-animate)
        $scope.animateElementOut = function($el) {
          $el.addClass('timeline-hidden');
          $el.removeClass('bounce-in');
        };

        $scope.leftAlign = function() {
          $scope.side = 'left';
        }

        $scope.rightAlign = function() {
          $scope.side = 'right';
        }

        $scope.defaultAlign = function() {
            $scope.side = ''; // or 'alternate'
          }

          this.sendArtist = function(){
            Albums.sendSearch(this.artist);
          }
        });


// ;


//     myapp.config(function($stateProvider) {
//   $stateProvider.state('user', {
//     url:         '',
//     controller: 'ExampleCtrl',
//     templateUrl: 'example.html'
//   });
// });












