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
    let randomSQL = 'SELECT itemID FROM items ORDER BY RANDOM() LIMIT 50;';

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
        res.send({result: "failure"});
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
  console.log("trying to rate item for user " + user);

  if (user == undefined) {
    res.send({result: "failure"});
  } else {

    let itemID = req.body.itemID;
    let wouldBuy = req.body.wouldBuy;
    let haveHeard = req.body.haveHeard;
    let noRecNeeded = req.body.noRecNeeded;

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

        let firstItem = null;
        let table = null;
        let column = null;
        let remaining = null;

        if (row.RRSitems != undefined) { //User is rating random item
          firstItem = row.RRSitems.split(",")[0];
          table = "RRSresults";
          column = "RRSitems";
          remaining = row.RRSitems.split(",").slice(1).join();
        } else if (row.SRSitems != undefined) {
          firstItem = row.SRSitems.split(",")[0];
          table = "SRSresults";
          column = "SRSitems";
          remaining = row.SRSitems.split(",").slice(1).join();
        } else {
          console.log("Error: no items left to rate");
          res.send({result: 'failure'});
          return;
        }

        console.log("Remaining: " + remaining);

        if (firstItem != itemID) {
          res.send({result: 'failure'})
        } else {

          let editSQL = 'UPDATE users SET ' + column + '=\'' + remaining + '\' WHERE email=\'' + user + '\';';

          if (remaining.length == 0) {
            editSQL = 'UPDATE users SET ' + column + '=null WHERE email=\'' + user + '\';';
          }

          db.run(editSQL, function(err) {
            if (err) {
              console.log(err);
              res.send({result: "failure"});
            } else {
              addRatingSQL = 'INSERT INTO ' + table + '(email, itemID, wouldBuy, haveHeard, noRecNeeded, timestamp)  VALUES (\'' +
              user + '\', \'' +
              itemID + '\', \'' +
              wouldBuy + '\', \'' +
              haveHeard + '\', \'' +
              noRecNeeded + '\', \'' +
              Date.now().toString() + '\');';

              db.run(addRatingSQL, function(err) {
                if (err) {
                  console.log(err);
                  res.send({result: "failure"});
                } else {
                  res.send({result: "success"});
                }
              });
            }
          });

          console.log("User rated " + firstItem);
        }
      } else {
        res.send({result: "failure"});
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
