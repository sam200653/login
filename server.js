const express = require('express');

const session = require('cookie-session');
const bodyParser = require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const fs = require('fs');
const formidable = require('express-formidable');
const mongourl = 'mongodb+srv://enzochan0:c947166221cluster0.kvpjj.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'test';

app.set('view engine','ejs');

const SECRETKEY = 'I want to pass the prj';

const users = new Array(
	{name: 'demo', password: ''},
	{name: 'student', password: ''}
);

app.use(formidable());
app.set('view engine','ejs');

app.use(session({   //cookies
  name: 'loginSession',
  keys: [SECRETKEY]
}));

// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const handle_Find = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        findDocument(db, criteria, (docs) => {
            client.close();
            console.log("Closed DB connection");
            res.status(200).render('list');
            /*
            res.writeHead(200, {"content-type":"text/html"});
            res.write(`<html><body><H2>Bookings (${docs.length})</H2><ul>`);
            for (var doc of docs) {
                //console.log(doc);
                res.write(`<li>Booking ID: <a href="/details?_id=${doc._id}">${doc.bookingid}</a></li>`);
            }
            res.end('</ul></body></html>');
            */
        });
    });
}




app.get('/', (req,res) => {
	console.log(req.session);
	if (!req.session.authenticated) {    // user not logged in!
		res.redirect('/login');
	} else {
		res.status(200).render('home',{name:req.session.username});
	}
});


app.get('/login', (req,res) => {
	res.status(200).render('login',{});
});

app.post('/login', (req,res) => {
	users.forEach((user) => {
		if (user.name == req.body.name && user.password == req.body.password) {
			// correct user name + password
			// store the following name/value pairs in cookie session
			req.session.authenticated = true;        // 'authenticated': true ***************************************
			req.session.username = req.body.name;	 // 'username': req.body.name		******************************
		}
	});
	res.redirect('/home');
});



app.get('/logout', (req,res) => {
	req.session = null;   // clear cookie-session
	res.redirect('/');
});

app.listen(process.env.PORT || 8099);
