var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var pg = require('pg');
var mongoose = require('mongoose');
var allsong;

mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind('connection error:'));
db.once('open', function callback (){
  var songSchema = mongoose.Schema({
    decade: String,
    artist: String, 
    song: String,
    weeksAtOne: Number
  });
  var Song = mongoose.model('songs', songSchema);
  // Create seed data
  var seventies = new Song({
    decade: '1970s',
    artist: 'Debby Boone',
    song: 'You Light Up My Life',
    weeksAtOne: 10
  });

  var eighties = new Song({
    decade: '1980s',
    artist: 'Olivia Newton-John',
    song: 'Physical',
    weeksAtOne: 10
  });

  var nineties = new Song({
    decade: '1990s',
    artist: 'Mariah Carey',
    song: 'One Sweet Day',
    weeksAtOne: 16
  });

  seventies.save();
  eighties.save();
  nineties.save();

  Song.update( {song:'One Sweet Day'}, {$set:{artist: 'Mariah Carey'}},
    function (err, numberAffected, raw){
      if (err) return handleError(error);
      allsong = Song.find({weeksAtOne: {$gte: 10}}).sort({decade: 1});
      // allsong.exec(function(err, docs){
      //   if (err) throw err;
      //   docs.forEach(function(doc){
      //     console.log( 'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] + 
      //       ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.');

      //   });


      // });
    }

    );

});


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



app.get('/db', function (request, response) {
  // pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  //   client.query('SELECT * FROM test_table', function(err, result) {
  //     done();
  //     if (err)
  //      { console.error(err); response.send("Error " + err); }
  //     else
  //      { response.render('pages/db', {results: result.rows} ); }
  //   });
  // });
var result = ['haha'];
allsong.exec(function(err, docs){
        if (err) throw err;
        docs.forEach(function(doc){
          // console.log( 'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] + 
          //   ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.');
        var temp = doc['song'];
        
        if (result.indexOf(temp)== -1) {
          result.push(temp);

        }
        });
  // console.log("inner:" + result);
  response.send(result);
      });
  

});

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.get('/too', function(request, response) {
  var result = ''
  var times = process.env.TIMES || 5
  for (i=0; i < times; i++)
    result += cool();
  response.send(result);
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
