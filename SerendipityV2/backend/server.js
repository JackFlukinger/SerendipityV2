const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const mysql = require('mysql');

const recsEach = 20;

const app = express();

var dbConfig = {
        host: 'localhost',
        user: 'produc31_admin',
        password: 'g9XQYmDzBEEN3d8',
        database: 'produc31_db',
    };

var conn;
function handleDisconnect() {
    conn = mysql.createConnection(dbConfig);  // Recreate the connection, since the old one cannot be reused.

    conn.on('error', function onError(err) {
        console.log('db error', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();

app.use(bodyParser.json());
app.use(cors({origin: 'https://productinterestsurvey.com', credentials: true}));
app.use(cookieParser());

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
}, app)
.listen(44444, function () {
  console.log('Server started!');
});

app.get('/api/stage', (req, res) => {
  let user = req.cookies.email;
  console.log("trying to fetch stage for user " + user);

  if (user == undefined) {
    res.send({stage: 1});
  } else {

    let sql = 'SELECT stage FROM `users` WHERE email=\'' + user + '\';';

    conn.query(sql, (err, rows) => {
      if (err | rows.length == 0) {
        res.send({stage: 1});
      } else {
        console.log(rows[0].stage);
        res.send({stage: rows[0].stage});
      }
    });
  }
});

app.get('/api/categories', (req, res) => {

  let sql = 'SELECT * FROM categories;';

  conn.query(sql, (err, rows) => {
    if (err) {
      res.send({result: 'failure'});
    } else {
      res.send({categories: rows});
    }
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

    //SQL to generate the random movies for the random recommender
    let randomSQL = 'SELECT itemID,categories FROM `items` WHERE itemID IN (SELECT itemID FROM (SELECT itemID FROM `items` ORDER BY RAND() LIMIT ' + (recsEach * 2) + ') t)'

    conn.query(randomSQL, (err, rows) => {
      if (err) {
        console.error('error connecting: ' + err.stack);
        res.send({result: "failure"});
        return;
      }
      let randomMovies = [];
      let almostRandomMovies = [];
      let count = 0;
      rows.forEach((row) => {
        count = count + 1;
        if (count > recsEach) { //If almost random movie (needs liked categories removed)
          cats = row.categories.replace("[","").replace("]","").split(", ").map(parseInt);
          overlap = categories.filter(value => cats.includes(value));
          //console.log(cats,categories,overlap);
          if (overlap.length == 0) {
            almostRandomMovies.push(row.itemID);
          }
        } else { //If just random movie
          randomMovies.push(row.itemID);
        }
      });

      let sql = 'INSERT INTO users(email, gender, age, stage, interestedCategories, RRSitems, ARRSitems) VALUES (\'' +
      email + '\', \'' +
      gender + '\', \'' +
      age + '\', \'' +
      '2' + '\', \'' +
      categories + '\', \'' +
      randomMovies + '\', \'' +
      almostRandomMovies + '\');';

      conn.query(sql, function(err) {
        if (err) {
          console.log(err);
          res.send({result: "failure"});
        } else {
          res.cookie('email', email, { maxAge: 315360000000, httpOnly: false }).send({"result": "success"});
        }

      });
    });

  }
});

app.get('/api/item', (req, res) => {
  let user = req.cookies.email;
  console.log("trying to fetch item for user " + user);

  if (user == undefined) {
    res.send({result: "failure"});
  } else {

    let sql = 'SELECT RRSitems, ARRSitems, SRSitems FROM users WHERE email=\''+ user + '\';';

    conn.query(sql, (err, rows) => {
      if (rows.length > 0) {
        let row = rows[0];
        if (row.RRSitems != undefined) {
          let firstItem = row.RRSitems.split(",")[0];
          let remaining = row.RRSitems.split(",").length + row.ARRSitems.split(",").length - 1;
          console.log(firstItem);
          let querySql = 'SELECT * FROM items WHERE itemID=\'' + firstItem + '\';';

          conn.query(querySql, (err, rows) => {
            if (rows.length > 0) {
              let row = rows[0];
              console.log(row);
              res.send({result: 'success', item: row, left: remaining});
            } else {
              res.send({result: 'failure'});
            }
          });

        } else if (row.RRSitems == undefined && row.ARRSitems != undefined) {
          let firstItem = row.ARRSitems.split(",")[0];
          let remaining = row.ARRSitems.split(",").length - 1;

          console.log(firstItem);
          let querySql = 'SELECT * FROM items WHERE itemID=\'' + firstItem + '\';';

          conn.query(querySql, (err, rows) => {
            if (rows.length > 0) {
              let row = rows[0];
              console.log(row);
              res.send({result: 'success', item: row, left: remaining});
            } else {
              res.send({result: 'failure'});
            }
          });
        } else if (row.RRSitems == undefined && row.ARRSitems == undefined && row.SRSitems != undefined) {
          let firstItem = row.SRSitems.split(",")[0];
          let remaining = row.SRSitems.split(",").length - 1;

          console.log(firstItem);
          let querySql = 'SELECT * FROM items WHERE itemID=\'' + firstItem + '\';';

          conn.query(querySql, (err, rows) => {
            if (rows.length > 0) {
              let row = rows[0];
              console.log(row);
              res.send({result: 'success', item: row, left: remaining});
            } else {
              res.send({result: 'failure'});
            }
          });
        } else if (row.RRSitems == undefined && row.ARRSitems == undefined && row.SRSitems == undefined) { //Ratings have been completed

          let stageSQL = 'SELECT stage FROM users WHERE email = \'' + user + '\';'; //Get current stage

          conn.query(stageSQL, (err, rows) => {
            if (rows.length > 0) {
              let row = rows[0];
              console.log(row.stage);
              nextStage = parseInt(row.stage) + 1;

              let doneSql = 'UPDATE users SET stage=\'' + nextStage + '\' WHERE email = \'' + user + '\';';

              conn.query(doneSql, function(err) {
                if (err) {
                  console.log(err);
                  res.send({result: "failure"});
                } else {
                  res.send({result: "nextstage"});
                }
              });

            } else {
              res.send({result: "failure"});
            }
          });

        }
      } else {
        res.send({result: "failure"});
      }
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


    let sql = 'SELECT RRSitems, ARRSitems, SRSitems FROM users WHERE email=\''+ user + '\';';

    conn.query(sql, (err, rows) => {
      if (rows.length > 0) {
        let row = rows[0];
        let firstItem = null;
        let table = null;
        let column = null;
        let remaining = null;

        if (row.RRSitems != undefined) { //User is rating random item
          firstItem = row.RRSitems.split(",")[0];
          table = "RRSresults";
          column = "RRSitems";
          remaining = row.RRSitems.split(",").slice(1).join();
        } else if (row.ARRSitems != undefined) {
          firstItem = row.ARRSitems.split(",")[0];
          table = "ARRSresults";
          column = "ARRSitems";
          remaining = row.ARRSitems.split(",").slice(1).join();
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

          conn.query(editSQL, function(err) {
            if (err) {
              console.log(err);
              res.send({result: "failure"});
            } else {
              addRatingSQL = 'INSERT INTO ' + table + '(email, itemID, wouldBuy, haveHeard, noRecNeeded)  VALUES (\'' +
              user + '\', \'' +
              itemID + '\', \'' +
              wouldBuy + '\', \'' +
              haveHeard + '\', \'' +
              noRecNeeded + '\');';

              conn.query(addRatingSQL, function(err) {
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

  }

});
