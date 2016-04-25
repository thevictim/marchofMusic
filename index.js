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
// app.use(express.static(__dirname + '/public'));

var allsong;

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
  year: Number,
  imageurl: String
});
var Album = mongoose.model('albums', albumSchema);

db.once('open', function callback (){

  // Create seed data
  var pf = new Album({
    artist: 'Pink Floyd',
    name: 'Dark Side of the Moon', 
    year: 1971,
    imageurl: 'asdffasd'
  });


  pf.save();

});


app.post("/sendList", function(req, res) {
  console.log('------------------------node post------------------------');
  var albumList = req.body.list;
  console.log('parse');
  console.log(req.body);
  if (!req.body.list) {
    handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  }

  // var searchAlbums = function (query) {
  //   $.ajax({
  //     url: 'https://api.spotify.com/v1/search',
  //     data: {
  //       q: query,
  //       type: 'album'
  //     },
  //     success: function (response) {
  //       for (album in response.albums.items){

  //         var newAlbum = new Album({
  //           artist: album.artist.name,
  //           name: album.name, 
  //           year: album.release_date,
  //           imageurl: album.images[0].url
  //         });

  //         db.collection(albums).insertOne(newAlbum, function(err, doc) {
  //           if (err) {
  //             handleError(res, err.message, "Failed to create new contact.");
  //           } else {
  //             res.status(201).json(doc.ops[0]);
  //           }
  //         });

  //       }      
  //     }
  //   });
  // };
  for (album in albumList){
    var newAlbum = new Album({
      artist: album.artist,
      name: album.name, 
      year: album.year,
      imageurl: album.imageurl
    });

    Album.collection.insert(newAlbum, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new contact.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });

  }


  // searchAlbums(newArtist);
  // console.log(newArtist);
});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}





// app.post("/sendArtist", function(req, res){
//     var newArtist = req.body;
// });
// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

// app.get('/db', function (request, response) {
//   // pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//   //   client.query('SELECT * FROM test_table', function(err, result) {
//   //     done();
//   //     if (err)
//   //      { console.error(err); response.send("Error " + err); }
//   //     else
//   //      { response.render('pages/db', {results: result.rows} ); }
//   //   });
//   // });
//   var result = ['haha'];
//   allsong.exec(function(err, docs){
//         if (err) throw err;
//         docs.forEach(function(doc){
//           // console.log( 'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] + 
//           //   ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.');
//         var temp = doc['song'];

//         if (result.indexOf(temp)== -1) {
//           result.push(temp);

//         }
//         });
//   // console.log("inner:" + result);
//     response.send(result);
//       });

// });

// app.get('/', function(request, response) {
//   // response.send('ga');
//   // response.sendFile(path.join(__dirname + '/index.html'));
// });


