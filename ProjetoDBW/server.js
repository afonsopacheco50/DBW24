var express = require('express');
const  mongoose = require('mongoose');
const server = require("http").createServer(app);
var mongoConfigs = require('./models/mongoConfig');

const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

var app = express();

app.set('view engine', 'ejs');

app.use('/public/', express.static('./public'));


const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;

const sessionMiddleware = session({ secret: "changeit", resave: false, saveUninitialized: false });
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb+srv://DBW24:OQdmPqIvHEXTM2UF@clusterdbw.1dbjr.mongodb.net/DBW24?authSource=admin&replicaSet=atlas-bek8xj-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true', {useNewUrlParser: true, useUnifiedTopology: true});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected!');
});


const AgSchema = new mongoose.Schema ({
    Username: String,
    Password: String,
    Email: String 
    });

//Set the behaviour
AgSchema.methods.verifyPassword = function (password) {
    return password === this.password;
  }
  
  //Compile the schema into a model
  const User = mongoose.model('Agentes', AgSchema);
  
  passport.use(new LocalStrategy(
      function(Username, Password, done) {
        User.findOne({ username: Username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (!user.verifyPassword(Password)) { return done(null, false); }
          return done(null, user);
        });
      }
  ));

  app.get("/", (req, res) => {
    const isAuthenticated = !!req.user;
    if (isAuthenticated) {
      console.log(`user is authenticated, session is ${req.session.id}`);
    } else {
      console.log("unknown user");
    }
    res.render(isAuthenticated ? "PageAgente.ejs" : "page.ejs", { root: __dirname });
  });


app.get('/login', function (req, res) {
    res.render("PageLogin");
});

app.get('/registo', function (req, res) {
    res.render("PageRegisto");
});

app.get('/Agente', function (req, res) {
    res.render("PageAgente");
});


app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/Agente",
      failureRedirect: "/login",
    })
  );

app.post("/registo",function(req,res){

    //New User in the DB
    const instance = new User({ Username: req.body.AgName, Password: req.body.AgPass, Email:req.body.AgEmail });
    instance.save(function (err, instance) {
      if (err) return console.error(err);
  
      //Let's redirect to the lofgin post which has auth
      res.redirect(307, '/login');
    });
  
});

passport.serializeUser((user, cb) => {
    console.log(`serializeUser ${user.id}`);
    cb(null, user.id);
  });
  
  passport.deserializeUser((id, cb) => {
    console.log(`deserializeUser ${id}`);
    User.findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
});


var servidor = app.listen(3030, function () {
    var port = servidor.address().port;
    console.log('Server listening ' + port);
});

