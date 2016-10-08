var http = require("http");
var passport = require('passport');
var LocalStrategy = require("passport-local").Strategy;
var mysql = require("mysql");
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt');
var app = express();

var mysql_password = process.env.MYSQL_PASSWORD;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes');
app.use('/', routes);

var connection = mysql.createConnection({
  // host: "fdb7.biz.nf:3306",
  // user: "1991601_cmimc",
  // password: mysql_password,
  // database: "1991601_cmimc"
  host: "localhost",
  user: "root",
  database: "cmimc"
});

connection.connect();

passport.use(new LocalStrategy(
  function(email, password, done) {
    var userinfo = connection.query("SELECT staffid, email, password, type, name, andrewid"+
      " FROM staff WHERE email='"+email+"' LIMIT 1");
    if(userinfo.length == 0)
    {//if the email is valid
       return done(null, false, { message: 'Incorrect username.' });
    }
    else
    {
      console.log(password);
      console.log(userinfo);
      var submitPassword = userinfo[0][2];
      //  bcrypt.hash(password, 10, function(err, hash) {
      //    if(hash === submitPassword)
      //    {//if the password is correct
      //      return done(null, userinfo);
      //    }
      //    else
      //    {//if the password is not correct
      //      return done(null, false, { message: 'Incorrect password.' });
      //    }
      // });
      if (submitPassword === password) {
        console.log('good');
        return done(null, userinfo);
      } else {
        return (null, false , { message: 'Incorrect password.' });
      }
   }
 }
));

app.use(passport.initialize());
app.use(passport.session());


app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    console.log("authentication success");
  });

var server = app.listen(8081, function () {
   console.log("Server running at http://localhost:8081/")
});
