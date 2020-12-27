const express = require("express");
const session = require("cookie-session");
const bodyParser = require("body-parser");
const app = express();

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
      req.session.username = req.body.username;
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
//////////////////////////////////////////////////////////////
app.get("/inserts", (req, res) => {
  res.status(200).render("inserts", {});
});

app.post("/inserts", (req, res) => {
  (async function () {
    const client = new MongoClient(mongourl);

    try {
      await client.connect();
      console.log("Connected correctly to server");
  
      const db = client.db("test2");
      const col = db.collection('restaurant');
      
      
      // Insert single documents
      await col.insertOne({
      "restaurarantID": req.body.id,
      "name":req.body.name,
      "borough":req.body.borough,
      "cusisine": req.body.cusisne,
      "street":req.body.street,
      "building":req.body.building,
      "zipcode":req.body.zipcode,
      "coord(LON)":req.body.coordLON,
      "coord(LAT)":req.body.coordLAT,
      //"photo":req.body.photo,
      "owner": req.session.username
    });
    console.log("inserted");

    

    //assert.equal(1, r.insertedCount);//
    //[{name:1}, {cusisine:1},{street:1},{building:1},{zipcode:1},{coordLON:1},{coordLAT:1},{photo:1}]//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
    app.get("/update", (req, res) => {
      res.status(200).render("update", {});
    });

/*    app.post("/inserts", (req, res) => {(async function() {
      const client = new MongoClient(url);
    
      try {
        await client.connect();
        console.log("Connected correctly to server");
    
        const db = client.db(dbName);
        const col = db.collection('updates');
        let r;

        Update a single document
        r = await col.updateOne(req.body,{
      inserts_name:req.body.restaurants_name,
      inserts_cusisine: req.body.restaurants_cusisne,
      inserts_street:req.body.restaurants_street,
      inserts_building:req.body.restaurants_building,
      inserts_zipcode:req.body.restaurants_zipcode,
      inserts_GPS_Coordinates_lon:req.body.restaurants_coordLON,
      inserts_GPS_Coordinates_lat:req.body.restaurants_coordLAT,
      inserts_photo:req.body.restaurants_photo,
      owner: req.body.name
      });


      } catch (err) {
        console.log(err.stack);
      }
    
      // Close connection
      client.close();
    })(); */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    app.get("/rate", (req, res) => {
      res.status(200).render("update", {});
    });
    

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    app.get("/delete", (req, res) => {
      res.status(200).render("delete", {});
    });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    app.get("/search", (req, res) => {
      res.status(200).render("search", {});
    });



    } catch (err) {
      console.log(err.stack);
    }

    client.close();
  })();
  
});

app.listen(8099);
