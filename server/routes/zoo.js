var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString;

var myRandom = require("../modules/myRandom.js");

if(process.env.DATABASE_URL) {//connecting to outside heroku database
    pg.defaults.ssl = true;
    connectionString = process.env.DATABASE_URL;
} else{//connecting to local database before being connected to heroku for testing purposes
    connectionString = 'postgress://localhost:5432/db_zoo';
}
router.post("/*", function(req,res){
    // post to insert new animal if type entered on form
    var animalType = req.body.animalType;
    // get a random number of animals from my random module
    var animalCount = myRandom(1,100);
    var strSql = '';
    var arrFields =[];
    console.log("totally insert into animals",req.body);
    pg.connect(connectionString, function(err, client, done){
        if (err){
          console.log('error connecting to DB:', err);
          res.status(500).send(err);
          done();
          return;
    }

    strSql = 'INSERT INTO tbl_animals ("animal_type", "animal_count") VALUES ($1,$2);';
    arrFields = [animalType, animalCount];
    var query = client.query(strSql,arrFields);
    console.log("strSql = ", strSql);
    console.log("arrFields = ", arrFields);
    query.on('end', function(){
      res.status(200).send("successful insert");
      done();
    });

    query.on('error', function(error){
      console.log("error inserting animal into DB:", error);
      res.status(500).send(error);
      done();
    });
  })
});

router.get("/*", function(req,res){

  console.log("hey you got some animals!");

  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;

    }
    var results=[];
    var query = client.query('SELECT * FROM tbl_animals ;');
    query.on('row', function(row){
    //   console.log("we got a row",row);
      results.push(row);
    });
    query.on('end', function(){
      res.send(results);
      done();
    });

    query.on('error', function(error){
      console.log("error returning animals:", error);
      res.status(500).send(error);
      done();

    });
  })
});

module.exports = router;
