var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Setup Mongo connection
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var options = { useUnifiedTopology: true, useNewUrlParser: true };

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    res.render('pages/index');
});

app.get("/class", function (req, res) {
    // Get data from MongoDB
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("game");
        var query = {};
        dbo.collection("product")
            .find(query)
            .toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
                res.render('pages/class', { games: result });
                db.close();
            });
    });
});

app.get("/classdetail/:id", function (req, res) {
    var classid = req.params.id;
    console.log(classid);

    // Get the class detail from mongodb
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("game");
        var query = {
            idg: classid
        };
        dbo.collection("product").findOne(query, function (err, result) {
            if (err) throw err;
            console.log(result);
            res.render('pages/classdetail', { detail: result });
            db.close();
        });
    });
});

app.get('/classedit/:name', function (req, res) {
    var gameEdit = req.params.name;
    MongoClient.connect(url, options, function (err, db) {
      if (err) throw err;
      var dbo = db.db("game");
      var query = { idg: gameEdit};
      dbo.collection("product").findOne(query, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render('pages/classedit', { detail: result });
        db.close();
      });
    });
  });
  
  app.post('/classsave', function (req, res) {
    var id = req.body.id;
    var name= req.body.name;
    var prices = req.body.price;
    var type = req.body.type;
    MongoClient.connect(url, options, function (err, db) {
      if (err) throw err;
      var dbo = db.db("game");
      var myquery = { idg: id };
      var newvalues = {
        $set: {
          idg: id,
          game_name: name,
          price: prices,
          type:type
        }
      };
      dbo.collection("product").updateOne(myquery, newvalues, function (err, result) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
        res.redirect("/class");
      });
    });
  });

  

    app.get('/classadd', function (req, res) {
        res.render('pages/classadd', );
      });
      
        app.post('/saveadd', function (req, res) {
          var id = req.body.id;
          var name = req.body.name;
          var price = req.body.price;
          var type = req.body.type;
          ////insert
          MongoClient.connect(url, options, function (err, db) {
            if (err) throw err;
            var dbo = db.db("game");
            var newclass = {
              idg: id,
              game_name: name,
              type: type,
              price: price,
      
            }
            dbo.collection("product").insertOne(newclass, function (err, result) {
              if (err) throw err;
              console.log("1 document inserted");
              db.close();
              res.redirect("/class");
            });
      
          });
        });

        app.get('/delete/:names', function (req, res) {
            var name = req.params.names;
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("game");
                    var myquery = {game_name:name};
                    dbo.collection("product").deleteOne(myquery, function(err, obj) {
                      if (err) throw err;
                      console.log("1 document deleted");
                      db.close();
                      res.redirect("/class");
                    });
                  });

          });

app.listen(8080);
console.log('Express started at http://localhost:8080');