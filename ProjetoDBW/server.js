var express = require('express');
var mongoConfigs = require('./bd/mongoConfig');

var app = express();

app.set('view engine', 'ejs');

app.use('/public/', express.static('./public'));

app.get('/', function (req, res) {
    res.render("page");
});

app.get('/login', function (req, res) {
    res.render("PageLogin");
});

app.get('/registo', function (req, res) {
    res.render("PageRegisto");
});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Server listening ' + port);
});