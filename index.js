const express = require("express");
const session = require("cookie-session");
const bodyParser = require("body-parser");
const app = express();

const MongoClient = require("mongodb").MongoClient;
const mongourl =
  "";
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
/////////////////////////////////////////////////////////



app.get("/inserts", (req, res) => {
  res.status(200).render("inserts", {});
});

app.post("/inserts", (req, res) => {
  (async function() {
    const client = new MongoClient(url);

    try {
      await client.connect();
      console.log("Connected correctly to server");

      const db = client.db(dbName);

      // Insert a single document
      await col.insertOne({      "restaurarantID": req.body.id,
      "name":req.body.name,
      "borough":req.body.borough,
      "cusisine": req.body.cusisne,
      "street":req.body.street,
      "building":req.body.building,
      "zipcode":req.body.zipcode,
      "coordLON":req.body.coordLON,
      "coordLAT":req.body.coordLAT,
      //"photo":req.body.photo,
      "owner": req.session.username
    });
    } catch (err) {
      console.log(err.stack);
    }

    // Close connection
    client.close();
  })();

});

    //assert.equal(1, r.insertedCount);//
    //[{name:1}, {cusisine:1},{street:1},{building:1},{zipcode:1},{coordLON:1},{coordLAT:1},{photo:1}]//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
    app.get("/update", (req, res) => {
      res.status(200).render("update", {});
    });
    app.post("/update", (req, res) => {
      (async function () {
        const client = new MongoClient(mongourl);

        try {
          await client.connect();
          console.log("Connected correctly to server");

          const db = client.db("test2");
          const col = db.collection('restaurant');
          if (!req.session.username == "owner") {
            res.redirect("/home");
          } else {

          await col.findAndModify({"restaurarantID": req.body.id,
          "name":req.body.name,
          "borough":req.body.borough,
          "cusisine": req.body.cusisne,
          "street":req.body.street,
          "building":req.body.building,
          "zipcode":req.body.zipcode,
          "coordLON":req.body.coordLON,
          "coordLAT":req.body.coordLAT});};
        } catch (err) {
          console.log(err.stack);
        }
        client.close();
      })();
    
    });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    app.get("/rate", (req, res) => {
      res.status(200).render("update", {});
    });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    app.get("/delete", (req, res) => {
      res.status(200).render("delete", {});
    });
    app.post("/delete", (req, res) => {
      (async function () {
        const client = new MongoClient(mongourl);

        try {
          await client.connect();
          console.log("Connected correctly to server");

          const db = client.db("test2");
          const col = db.collection('restaurant');
          if (!req.session.username == "owner") {
            res.redirect("/home");
          } else {

          await col.drop({"restaurarantID": req.body.id,
          "name":req.body.name,
          "borough":req.body.borough,
          "cusisine": req.body.cusisne,
          "street":req.body.street,
          "building":req.body.building,
          "zipcode":req.body.zipcode,
          "coordLON":req.body.coordLON,
          "coordLAT":req.body.coordLAT});};
        }catch (err) {
          console.log(err.stack);
        }
        client.close();
      })();
    
    });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    app.get("/search", (req, res) => {
      res.status(200).render("search", {});
    });
    app.post("/search", (req, res) => {
      (async function () {
        const client = new MongoClient(mongourl);
    
        try {
          await client.connect();
          console.log("Connected correctly to server");
    
          const db = client.db("test2");
          const col = db.collection('restaurant');

          const restaurants = await col.find({"name": req.body.name}).limit().toArray();
          res.status(200).render("searchresult", {restaurants: restaurants});
    
          
        
      }  catch (err) {
          console.log(err.stack);
      }
    

    client.close();
  })();
  
});
//////////////////////////////////////////////////////////////

app.get('/seach?name=*', (req, res) => {
  (async function () {
    var temp = req.params.id;
    const client = new MongoClient(mongourl);

    try {
      await client.connect();
      console.log("Connected correctly to server");

      const db = client.db(dbName);
      const col = db.collection('restaurant');
      
      const restaurants = await col.find({"name": temp}).limit().toArray();
      console.log(restaurants);
      res.status(200).render("seachresult", {restaurants: restaurants});
    } catch (err) {
      console.log(err.stack);
    }

    client.close();
  })();
  
});

//////////////////////////////////////////////////////////////

app.get('/:id', (req, res) => {
  (async function () {
    var temp = req.params.id;
    const client = new MongoClient(mongourl);

    try {
      await client.connect();
      console.log("Connected correctly to server");

      const db = client.db(dbName);
      const col = db.collection('restaurant');
      
      const restaurants = await col.find({"name": temp}).limit().toArray();
      console.log(restaurants);
      res.status(200).render("display", {restaurants: restaurants});
    } catch (err) {
      console.log(err.stack);
    }

    client.close();
  })();
  
});

app.listen(8099);
