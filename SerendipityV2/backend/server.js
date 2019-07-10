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

});
