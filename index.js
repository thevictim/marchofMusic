var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var path = require('path');
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = 'd4c61416e62547dfa93151351cb943ce'; // Your client id
var client_secret = '110d618ada9e48eb946335dfad26b79e'; // Your client secret
var redirect_uri = 'http://localhost:5000/callback'; // Your redirect uri

var access_token = '';
var refresh_token = 'AQBQ0FRw4_2WjVbYjHf3EG4SKA95j-Z75qLZ6UMYWV-AkR-SloGLv59FUDY7hZ5Lnn4HZDwPPthTutWD6KHkBncbP3-nzxJUTbL7dKh_WcPpQE-WK4IIznOX9o-GKl1MTNE>';

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';


app.use(express.static(__dirname + '/public')).use(cookieParser());;
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

mongoose.connect(process.env.MONGODB_URI ,function(err){
  if(err) throw err;
  console.log('Database connected');
  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
});

var db = mongoose.connection;

var albumSchema = mongoose.Schema({
  artist: String,
  name: String, 
  year: String,
  imageurl: String
});
var Album = mongoose.model('albums', albumSchema);

//----------------------------Spotify Authorization ---------------------------

app.get('/login', function(req, res) {
  console.log("-------------------login-------------------");
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  var address = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    });
// console.log(address);
  var state = generateRandomString(16);
  res.send(address);
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter
  console.log("-------------------callback-------------------");

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

            access_token = body.access_token;
            refresh_token = body.refresh_token;
              console.log('refresh_token '+ refresh_token);
                console.log('access_token '+ access_token);

        // var options = {
        //   url: 'https://api.spotify.com/v1/me',
        //   headers: { 'Authorization': 'Bearer ' + access_token },
        //   json: true
        // };

        // use the access token to access the Spotify Web API
        // request.get(options, function(error, response, body) {
        //   console.log(body);
        // });
        // console.log('/#' +
        //   querystring.stringify({
        //     access_token: access_token,
        //     refresh_token: refresh_token
        //   }));
        // // we can also pass the token to the browser to make requests from there
        res.redirect('/');
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {
  console.log("-------------------refresh-------------------");
  
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.send({
        'access_token': access_token,
        'refresh_token': refresh_token
      });
    }
  });
  console.log('refresh_token '+ refresh_token);
                console.log('access_token '+ access_token);
});
//----------------------------Spotify Authorization ---------------------------

app.post("/sendList", function(req, res) {
  var album = req.body;
  if (!req.body) {
    handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  }

  var newAlbum = new Album({
    artist: album.artist,
    name: album.name, 
    year: album.year,
    imageurl: album.imageurl
  });

  newAlbum.save(function(err, doc){
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc);
    }
  });
  console.log(newAlbum);
});

app.get("/getAlbums", function(req, res){

  Album.find().lean().exec(function(err, albums){
    return res.end(JSON.stringify(albums));
  })

});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

