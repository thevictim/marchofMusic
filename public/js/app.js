
'use strict';
var nameList = [];
var token = 'BQCa-bvl8Y03xcydsd1kiyh7GKIoNIJ6DLm--SeSPd7gqwyXCBsq76El4-rTOm4mYCKkWbnOlBH3XCUOgAw9qzvlBCtuqWVVA5sv5xYPlqrwcnP52D8KRJ-0rJH7MkJAQcUYvs4WBD0X';
var myapp = angular.module('trashApp', [
  'angular-timeline', 'ngRoute','ngSanitize',
  'ui.router',
  'angular-scroll-animate'])
.config(function($routeProvider) {
  $routeProvider.when('/', {
    controller: 'ExampleCtrl',
    templateUrl: 'example.html',
    resolve: {
        'albums': function(Albums){
          console.log('***********************');
          // addEvent();
          return Albums.getAlbums();
        }
    }
  });
}).service("Albums", ["$http",function($http){
  this.sendSearch = function(album) {
    // console.log(albumList);
    return $http.post("/sendList",album).
    then(function(response) {
      return response;
    }, function(response) {
      // console.log(response);
      alert("Cannot find artist.");
    });
  }
this.getAlbums = function(){
  return $http.get("/getAlbums").
        then(function(response){
          return response;
        }, function(response){
          alert("Error getting albums");
        });
}

}])
.controller('ExampleCtrl', ['$scope', 'albums', 'Albums', function($scope, albums, Albums){
  var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. ";

  $scope.side = '';
  $scope.events = [];
  $scope.addEvent = function(artist, albumName, year,month, imageurl) {
    $scope.events.push({
      badgeClass: 'info',
      badgeIconClass: 'glyphicon-check',
      title: albumName,
      when: artist + '  '+ year+' '+month,
      year: year,
      month: month,
      contentHtml:'<img class="img-responsive" src="'+imageurl+'">'
    });

  };
    albums.data.forEach(function(album){
      var when = album.year.toString();
      var year = when.substring(0,4);
      var month = when.length>4 ? when.substring(5,7):'';
      if(nameList.indexOf(album.name)==-1){
        $scope.addEvent(album.artist, album.name, year,month, album.imageurl);
        nameList.push(album.name);
      }
  });
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

        $scope.sendArtist = function(){
            
            var query = $scope.artist;
            console.log('Looking for: ' + query);
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
                console.log("Found id: "+ artist_id);
                $.ajax({
                  url: 'https://api.spotify.com/v1/artists/'+ artist_id+'/albums',
                  headers: {
                            "Authorization": 'Bearer '+ token
                          },
                  data: {
                        album_type: 'album',
                        limit: 10 
                  },
                  success: function(response){
                    console.log("Number of albums: " + response.items.length);
                    response.items.forEach(function(album){
                        var album_id = album.id;
                        $.ajax({
                          url: 'https://api.spotify.com/v1/albums/'+album_id,
                          headers: {
                            "Authorization": 'Bearer '+ token
                          },
                          data: {
                              market: 'US'
                          },
                          success: function(response){
                            var albumName = response.name;
                            if(nameList.indexOf(albumName) == -1){
                              nameList.push(albumName);
                              var newAlbum = {
                              artist: response.artists[0].name,
                              name: albumName, 
                              year: response.release_date,
                              imageurl: response.images[0].url
                            };
                              var when = response.release_date.toString();
                              var year = when.substring(0,4);
                              var month = when.length>4 ? when.substring(5,7):'';
                              $scope.addEvent(response.artists[0].name, response.name, year, month, response.images[0].url);
                              Albums.sendSearch(newAlbum);

                            }
                            
                          }
                        });
                      }); 
                  }
                });
              }

            });

            
          };

        }]);













