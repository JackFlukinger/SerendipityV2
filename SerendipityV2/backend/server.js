const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();

const dbPath = '../../../serendipityDatabase.db';

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.listen(8000, () => {
  console.log('Server started!');
});

app.get('/api/stage', (req, res) => {
  let user = req.cookies.email;
  console.log("trying to fetch stage for user " + user);

  if (user == undefined) {
    res.send({stage: 1});
  } else {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the SQlite database.');
    });

    let sql = 'SELECT stage FROM users WHERE email = \'' + user + '\';';

    db.get(sql, (err, row) => {
      if (row) {
        console.log(row.stage);
        res.send({stage: row.stage});
      } else {
        res.send({stage: 1});
      }
    });

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Closed the database connection.');
    });
  }
});

app.get('/api/categories', (req, res) => {
  let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
  });

  let sql = 'SELECT * FROM categories;';

  db.all(sql, (err, rows) => {
    if (rows) {
      res.send({categories: rows});
    } else {
      res.send("Backend Error");
    }
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Closed the database connection.");
  });
});

app.post('/api/users', (req, res) => {
  console.log("trying to create user");

  let email = req.body.email;
  let age = req.body.age;
  let gender = req.body.gender;
  let categories = req.body.categories;

  //Validation checks
  if ((age<0 || age>100) || !email.includes('@') || !email.includes('.') || !(gender == 'Male' || gender =='Female' || gender == 'Other') || categories.length < 10){

    res.send({result: "failure"});
  } else {

    console.log(email, age, gender, categories);

    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the SQlite database.');
    });

    //SQL to generate the random movies for the random recommender
    let randomSQL = 'SELECT itemID FROM items ORDER BY RANDOM() LIMIT 100;';

    db.all(randomSQL, (err, rows) => {
      if (err) {
        throw err;
      }
      let randomMovies = [];
      rows.forEach((row) => {
        randomMovies.push(row.itemID);
      });

      let sql = 'INSERT INTO users(email, gender, age, stage, interestedCategories, RRSitems) VALUES (\'' +
      email + '\', \'' +
      gender + '\', \'' +
      age + '\', \'' +
      '2' + '\', \'' +
      categories + '\', \'' +
      randomMovies + '\');';

      db.run(sql, function(err) {
        if (err) {
          console.log(err);
          res.send({result: "failure"});
        } else {
          res.cookie('email', email, { maxAge: 315360000000, httpOnly: false }).send({"result": "success"});
        }

      });
    });

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Closed the database connection.');
    });
  }
});

app.get('/api/item', (req, res) => {
  let user = req.cookies.email;
  console.log("trying to fetch item for user " + user);

  if (user == undefined) {
    res.send({result: "failure"});
  } else {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        res.send({result: "failure"});
        return console.error(err.message);
      }
      console.log('Connected to the SQlite database.');
    });

    let sql = 'SELECT RRSitems, SRSitems FROM users WHERE email=\''+ user + '\';';

    db.get(sql, (err, row) => {
      if (row) {

        if (row.RRSitems != undefined) {
          let firstItem = row.RRSitems.split(",")[0];
          console.log(firstItem);
          let querySql = 'SELECT * FROM items WHERE itemID=\'' + firstItem + '\';';

          db.get(querySql, (err, row) => {
            if (row) {
              console.log(row);
              res.send({result: 'success', item: row});
            } else {
              res.send({result: 'failure'});
            }
          });

        } else if (row.RRSitems == undefined && row.SRSitems != undefined) {
          let firstItem = row.SRSitems.split(",")[0];
          console.log(firstItem);
          let querySql = 'SELECT * FROM items WHERE itemID=\'' + firstItem + '\';';

          db.get(querySql, (err, row) => {
            if (row) {
              console.log(row);
              res.send({result: 'success', item: row});
            } else {
              res.send({result: 'failure'});
            }
          });
        } else if (row.RRSitems == undefined && row.SRSitems == undefined) { //Ratings have been completed

          let doneSql = 'UPDATE users SET stage=\'3\' WHERE email = \'' + user + '\';';

          db.run(doneSql, function(err) {
            if (err) {
              console.log(err);
              res.send({result: "failure"});
            } else {
              res.send({result: "nextstage"});
            }
          });

        }
      } else {
        res.send("Backend Error");
      }
    });

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Closed the database connection.");
    });
  }
});

app.post('/api/item', (req, res) => {
  let user = req.cookies.email;
  console.log("trying to fetch item for user " + user);

  if (user == undefined) {
    res.send({result: "failure"});
  } else {

    let wouldBuy = parseInt(req.body.wouldBuy);
    let haveHeard = parseInt(req.body.haveHeard);
    let noRecNeeded = parseInt(req.body.noRecNeeded);

    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        res.send({result: "failure"});
        return console.error(err.message);
      }
      console.log('Connected to the SQlite database.');
    });


    let sql = 'SELECT (RRSitems, SRSitems) FROM users WHERE email=\''+ user + '\';';

    db.all(sql, (err, rows) => {
      if (rows) { //Process withdrawn items

        console.log(rows);


      } else {
        res.send("Backend Error");
      }
    });

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Closed the database connection.");
    });

  }

});
