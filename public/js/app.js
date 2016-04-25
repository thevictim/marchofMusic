
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
}).service("Albums", ["$http",function($http){
  this.sendSearch = function(albumList) {
    // console.log(albumList);
    return $http.post("/sendList",albumList).
    then(function(response) {
      return response;
    }, function(response) {
      // console.log(response);
      alert("Error finding contacts.");
    });
  }


}])
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
            var query = this.artist;
            console.log(query);
            var albumList = {list: []};

            $.ajax({
              url: 'https://api.spotify.com/v1/search',
              data: {
                q: query,
                type: 'artist',
                market: 'US',
                limit: 1
              },
              success: function (response){        
                var artist_id = response.artists.items[0].id;
                console.log(artist_id);
                $.ajax({
                  url: 'https://api.spotify.com/v1/artists/'+ artist_id+'/ablums',
                  headers: {
                            "Authorization": 'Bearer BQByKBNgoSTPj2C88h9fzwg1FYu08ruyNxFPhXlqboux9uQJaBGB_g7cTXZmbSkb1cbuLXGYskTj-DlFQJBIxM6wGUHt3mvlV-3SscSYKRlCj6rnl_6WPclybgshqX9KjM4pLgPcuuwe'
                          },
                  data: {
                        album_type: 'album',
                        limit: 20
                  },
                  success: function(response){
                    response.items.forEach(function(album){
// -------------------
                        var album_id = album.id;
                        $.ajax({
                          url: 'https://api.spotify.com/v1/albums/'+album_id,
                          headers: {
                            "Authorization": 'Bearer BQByKBNgoSTPj2C88h9fzwg1FYu08ruyNxFPhXlqboux9uQJaBGB_g7cTXZmbSkb1cbuLXGYskTj-DlFQJBIxM6wGUHt3mvlV-3SscSYKRlCj6rnl_6WPclybgshqX9KjM4pLgPcuuwe'
                          },
                          data: {
                              market: 'US'
                          },
                          success: function(response){
                              var newAlbum = {
                                artist: response.artists[0].name,
                                name: response.name, 
                                year: response.release_date,
                                imageurl: response.images[0].url
                              };
                              console.log(response.release_date);
                              albumList.list.push(newAlbum);
                          }
                        });
// -------------------

                      }); 
                      
                      Albums.sendSearch(albumList);

                  }
                });
              }

            });

            
          };

        });













