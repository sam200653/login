const express = require("express");
const session = require("cookie-session");
const bodyParser = require("body-parser");
const app = express();

const mongo = require('mongodb');
const MongoClient = require("mongodb").MongoClient;
const mongourl =
  "mongodb+srv://sam200653:sam200653@cluster0.qpvzu.mongodb.net/test2?retryWrites=true&w=majority";
const dbName = "test2";

const users = new Array(
  { name: "demo", password: "" },
  { name: "student", password: "" }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "XASDASDA", resave: true, saveUninitialized: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/login");
  } else {
    res.status(200).render("home", { name: req.session.username }); //go back login unless cookies logined
  }
});

app.get("/home", (req, res) => {
  res.status(200).render("home", {});
});
//////////////////////////////////////////////////////////////
app.get("/login", (req, res) => {
  res.status(200).render("login", {});
});

app.post("/login", (req, res) => {
  console.log(req.body.username);
  users.forEach((user) => {
    if (user.name == req.body.username && user.password == req.body.password) {
      req.session.authenticated = true;
      req.session.username = req.body.name;
      res.redirect("/home");
    }
  });
  res.redirect("/login");
});
/////////////////////////////////////////////////////////////
app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});
//////////////////////////////////////////////////////////////
app.get("/list", (req, res) => {
  (async function () {
    const client = new MongoClient(mongourl);

    try {
      await client.connect();
      console.log("Connected correctly to server");

      const db = client.db(dbName);
      const col = db.collection('restaurant');

      const restaurants = await col.find({}).toArray();
     
      res.status(200).render("list", {restaurants: restaurants});
    } catch (err) {
      console.log(err.stack);
    }

    client.close();
  })();
  
});

app.listen(8099);
