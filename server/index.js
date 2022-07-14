'use strict';

const express = require('express');
const morgan = require('morgan');
const {body, oneOf, validationResult} = require('express-validator');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

// init express
const app = new express();
const port = 3001

const Database = require('./database');
const db = new Database("Database.db");

// Insert useful middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

passport.use(new LocalStrategy(function(email, password, done) {
  db.getUser(email.toLowerCase(), password)
    .then((user) => {
      if (user) done(null, user);
      else      done({status: 401, msg: "Incorrect email and/or password"}, false);
    }).catch(() => /* db error */ done({status: 500, msg: "Database error"}, false));
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.getUserById(id)
    .then(user => done(null, user))
    .catch(err => done(err, null));
});

app.use(session({
  secret: "9550afa20e735786deff50004fdf5164a3df10fc731db38780060d302f57b99a",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

/// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({errors: ["Not authenticated"]});
};

// GET
app.get('/api/indovinelli', async (req, res) => {
  try {
    const indovinelli = await db.getIndovinelli();
    res.status(200).json(indovinelli);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await db.getUsers();
    res.status(200).json(users);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.get('/api/startTime/:idIndovinello', async (req, res) => {
  try {
    const startTime = await db.getStartTime(req.params.idIndovinello);
    res.status(200).json(startTime);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.get('/api/risposte/:id', async (req, res) => {
  try {
    const risposte = await db.getRisposte(req.params.id);
    res.status(200).json(risposte);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// POST
app.post("/api/indovinello", async (req, res) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
      res.status(422).json({errors: err.errors.map(e => e.msg)});
    }
    else {
      try {
        await db.createIndovinello(req.body, req.user.id);
        res.status(201).end();
      } catch(err) {
        res.status(500).json(err);
      }
    }
});

app.post("/api/risposta", async (req, res) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    res.status(422).json({errors: err.errors.map(e => e.msg)});
  }
  else {
    try {
      await db.createRisposta(req.body, req.user.id);
      res.status(201).end();
    } catch(err) {
      res.status(500).json(err);
    }
  }
});

// PUT
app.put("/api/stato/:id", async (req, res) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    res.status(422).json({errors: err.errors.map(e => e.msg)});
  }
  else {
    try {
      await db.updateStato(req.body, req.params.id);
      res.status(200).end();
    } catch(err) {
      res.status(500).json(err);
    }
  }
});

app.put("/api/startTime/:idIndovinello", async (req, res) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    res.status(422).json({errors: err.errors.map(e => e.msg)});
  }
  else {
    try {
      await db.updateStartTime(req.body, req.params.idIndovinello);
      res.status(200).end();
    } catch(err) {
      res.status(500).json(err);
    }
  }
});

app.put("/api/points", async (req, res) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    res.status(422).json({errors: err.errors.map(e => e.msg)});
  }
  else {
    try {
      await db.updatePoints(req.body, req.user.id);
      res.status(200).end();
    } catch(err) {
      res.status(500).json(err);
    }
  }
});

// LOGIN 
app.post("/api/login",
  body("username", "username is not a valid email").isEmail(),
  body("password", "password must be a non-empty string").isString().notEmpty(),
  (req, res, next) => {
    const err = validationResult(req);
    const errList = [];
    if (!err.isEmpty()) {
      errList.push(...err.errors.map(e => e.msg));
      return res.status(422).json({errors: errList});
    }
    
    passport.authenticate("local", (err, user) => {
      if (err) {
        res.status(err.status).json({errors: [err.msg]});
      } else {
        req.login(user, err => {
          if (err) return next(err);
          else res.json({id: user.id, email: user.username, name: user.name});
        });
      }
    })(req, res, next);
});

app.delete("/api/session", isLoggedIn, (req, res) => {
  req.logout(() => res.end());
});

app.get("/api/user", isLoggedIn, (req, res) => {
  res.json({id: req.user.id, email: req.user.username, name: req.user.name});
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


// -------- NOT IN USE ---------
// POST USER
/*
app.post("/api/user", async (req, res) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    res.status(422).json({errors: err.errors.map(e => e.msg)});
  }
  else {
    try {
      await db.createUser(req.body);
      res.status(200).end();
    } catch(err) {
      res.status(500).json(err);
    }
  }
});
*/

// CREATE TABLES
/*
app.get('/api/tableIndovinelli', async (req, res) => {
  try {
    await db.newTableIndovinelli();
    res.status(200).json("worked");
  } catch(err) {
    res.status(500).json(err);
  }
});

app.get('/api/tableRisposte', async (req, res) => {
  try {
    await db.newTableRisposte();
    res.status(200).json("worked");
  } catch(err) {
    res.status(500).json(err);
  }
});

app.get('/api/tableUsers', async (req, res) => {
  try {
    await db.newTableUsers();
    res.status(200).json("worked");
  } catch(err) {
    res.status(500).json(err);
  }
});
*/