var express = require('express');
var http = require('http');
var path = require('path');
var elasticsearch = require('elasticsearch');


var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var app = express();


client.ping({
  requestTimeout: 30000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('Everything is ok');
  }
});


// client.indices.create({
//   index: 'blog'
// }, function (err, resp, status) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("create", resp);
//   }
// });

// Routes
app.post('/result', function(req, res) {

  client.search({
    index: 'blog',
    type: 'posts',
    q: 'PostName:Node.js'
  }).then(function (resp) {
    res.send(resp);
  }, function (err) {
    console.trace(err.message);
  });
  
});

app.post('/add',function(req, res) {
  
  client.index({
    index: 'blog',
    id: req.id,
    type: 'posts',
    body: req.data
  }, function (err, resp, status) {
    console.log(resp);
  });
  res.send('successfully inserted');
});


// Listen
var port = process.env.PORT || 3003;
app.listen(port);
console.log('Listening on localhost:'+ port)