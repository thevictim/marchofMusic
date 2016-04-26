var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var path = require('path');

app.use(express.static(__dirname + '/public'));
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

app.post("/sendList", function(req, res) {
  console.log('------------------------post to node------------------------');
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
  console.log('------------------------save completed------------------------');
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

