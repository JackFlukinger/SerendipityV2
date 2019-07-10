const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();

const dbPath = 'database.db';

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

app.get('/api/users', (req, res) => {
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

app.post('/api/users', (req, res) => {
  console.log("trying to create user");

  let email = req.body.email;
  let age = req.body.age;
  let gender = req.body.gender;
  let likedgenres = req.body.likedgenres;

  //Validation checks
  if ((age<0 || age>100) || !email.includes('@') || !email.includes('.') || !(gender == 'Male' || gender =='Female' || gender == 'Other') || likedgenres.length < 3){

    res.send({result: "failure"});
  } else {

    console.log(email, age, gender, likedgenres);

    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the SQlite database.');
    });

    //SQL to generate the random movies for the rapid fire haveseen stuff
    let randomSQL = 'SELECT id FROM movies ORDER BY RANDOM() LIMIT 100;';

    db.all(randomSQL, (err, rows) => {
      if (err) {
        throw err;
      }
      let randomMovies = [];
      rows.forEach((row) => {
        randomMovies.push(row.id);
      });

      let sql = 'INSERT INTO users(email, age, gender, favgenres, stage, possibleseen) VALUES (\'' +
      email + '\', \'' +
      age + '\', \'' +
      gender + '\', \'' +
      likedgenres + '\', \'' +
      '2' + '\', \'' +
      randomMovies + '\');';

      db.run(sql, function(err) {
        if (err) {
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

app.post('/api/rapidfire', (req, res) => {
  console.log("request for rapidfire movie");

  let user = req.cookies.email;
  let seen = req.body.seen;
  console.log(user, seen);

  //Validation checks


  let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
  });

  if (seen == "null") {
    let sql = 'SELECT possibleseen FROM users WHERE email = \'' + user + '\';';
    db.get(sql, (err, row) => {
      if (row) {
        let id = row.possibleseen.split(",")[0];
        console.log(id);
        let movieSQL = 'SELECT * FROM movies WHERE id = \'' + id + '\';';
        db.get(movieSQL, (err, row) => {
          if (row) {
            console.log(row);
            res.send({movie: row.movie, year: row.year, agerating: row.agerating, poster: row.poster});
          } else {
            res.send({error: "Backend Error"});
          }
        });
      } else {
        res.send({error: "Backend Error"});
      }
    });
  } else if (seen == "seen") {

  } else if (seen == "unseen") {

  }

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
});
