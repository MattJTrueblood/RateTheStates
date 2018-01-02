var mongoClient = require('mongodb').MongoClient;

console.log("put database stuff here?");

var url = "mongodb://localhost:27017/mydb";

mongoClient.connect(url, function(err, db) {
    if(err) throw err;
    console.log("Database created!");
    db.close();
});

