
'use strict';
var nameList = [];
var access_token = 'BQD1DNYeQwjeaZzFuZN3WG3WPRUDp7bdpZQ1qlrRiXFh-KbhzxC2LW0JzJc3COotAgZCA34VAmFT8_ujyZM9dvg9dw0ZQuEJKsb91B9qESLmSReHA8bTvhpDb4h43kNW_PH3j4VKPaf_';
var refresh_token = 'AQBCy3ca8ET96tPgXvXpmRlh1mL5ro_MbZM4Vyp6DmcYPfPIkQr5_X3X5flFkl7HGAQdszzGXti1hnPxEEY_ywdsXoTKBEUMgs2l2un6JBEs1SrE15heky7O0IhnL4eRBpE>';
var myapp = angular.module('trashApp', [
  'angular-timeline', 'ngRoute','ngSanitize',
  'ui.router',
  'angular-scroll-animate'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    controller: 'ExampleCtrl',
    templateUrl: 'example.html',
    resolve: {
        'albums': function(Albums){
          return Albums.getAlbums();
        }
    }
  }).when('/access/:access_token/:refresh_token', {
    controller: 'ExampleCtrl',
    templateUrl: 'example.html',
    resolve: {
        'albums': function(Albums){
          return Albums.getAlbums();
        }
    }
  });
  // .otherwise(
  //   {redirectTo:'/'}
  //   );

  $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}]).service("Albums", ["$http",function($http){
  this.sendSearch = function(album) {
    // console.log(albumList);
    return $http.post("/sendList",album).
    then(function(response) {
      return response;
    }, function(response) {
      console.log(response);
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
// this.login = function(){
//  return $http.post("/login");
//         // then(function(response){
//         //   return response;
//         // }, function(response){
//         //   console.log(response);
//         //   alert("Error log in ");
//         // });
// }
// this.refresh = function(){
//   return $http.get("/refresh_token").
//         then(function(response){
//           console.log("refreshing!");
//           return response.data;
//         }, function(response){
//           console.log(response);
//           alert("Error refresh token ");
//         });
// }

// this.getToken = function(){
//   return $http.get("/get_token").
//         then(function(response){
//           return response.data;
//         }, function(response){
//           console.log(response);
//           alert("Error getting token ");
//         });
// }

}])
.controller('ExampleCtrl', ['$location','$scope', 'albums', 'Albums','$routeParams','$http', function($location, $scope, albums, Albums, $routeParams, $http){

  var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. ";
  // access_token = $routeParams.access_token || '';
  refresh_token = $routeParams.refresh_token || '';

  $scope.side = '';
  $scope.events = [];
  $scope.addEvent = function(artist, albumName, year,month, imageurl) {
    $scope.events.push({
      badgeClass: 'info',
      badgeIconClass: 'glyphicon-music',
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
                var artist_name = response.artists.items[0].name;

                $.ajax({
                  url: 'https://api.spotify.com/v1/artists/'+ artist_id+'/albums',
                  headers: {
                            "Authorization": 'Bearer '+ access_token
                          },
                  data: {
                        album_type: 'album',
                        limit: 20 
                  },
                  success: function(response){
                    alert(artist_name + ":" + ' '+ response.items.length + " albums with unique name" );
                    response.items.forEach(function(album){
                        var album_id = album.id;
                        $.ajax({
                          url: 'https://api.spotify.com/v1/albums/'+album_id,
                          headers: {
                            "Authorization": 'Bearer '+ access_token
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
                  },
                        error: function(XMLHttpRequest, textStatus, errorThrown) { 
                            alert("Error: " + errorThrown + ". I'm sorry , the Spotify access token to get albums has expired. Email me guanyu@wustl.edu and I'll refresh the token asap."); 
                        }   
                });
              }

            });

            
          };
          
        //   $scope.start = function(){
        //         $http.get("/login").
        //         then(function(response){
        //           alert("back");
                  
        //         });

        //         Albums.login();

        //         Albums.login().then(function (d){
        //           console.log('here:   '+ d);
        //           $window.location.href=d;
        //         });
        //         Albums.refresh().then(function(d){
        //           console.log("Get: " + d.access_token);
        //           access_token = d.access_token;
        //           refresh_token = d.refresh_token;
        //         });
               

        //         $.ajax({
        //           url: '/refresh_token',
        //           data: {
        //             'refresh_token': refresh_token
        //           }
        //         }).done(function(data) {
        //           access_token = data.access_token;
        //             refresh_token = data.refresh_token
        //         });
        //         console.log('refresh_token '+ refresh_token);
        //         console.log('access_token '+ access_token);
        // };

        // function tick(){
        //     //get the mins of the current time
        //     var mins = new Date().getMinutes();
        //     if(mins == "00"){
        //       Albums.refresh().then(function(d){
        //       console.log(d.access_token);
        //       access_token = d.access_token;
        //       refresh_token = d.refresh_token;
        //     });
        //      }
        //     // console.log(access_token);
        // }

        // setInterval(function() { tick(); }, 30000);

        }]);













