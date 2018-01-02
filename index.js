
/* global __dirname, bodyParser */

var express = require('express');
var bodyParser = require('body-parser');
var path = require("path");
var dbModule = require ("./db");

var server = express();
    
server.use(bodyParser.json());
server.use(express.static(__dirname + "/public"));

server.post('/api', function(req, res) {
    console.log("Received data from ");
    console.log(JSON.stringify(req.body));
});

var port = 3000;
server.listen(port, function() {
    console.log('server listening on port ' + port);
});