"use strict";

var express = require('express'),
    app = express(),
    fs = require('fs');

app.get('/', function (req, res) {
    fs.readFile('./index.html', 'utf-8', function (err, contents) {
        res.send(contents);
    });
});

app.get('/jquery-2.1.0.min.js', function (req, res) {
    fs.readFile('./static/jquery-2.1.0.min.js', 'utf-8', function (err, contents) {
        res.send(contents);
    });
});

app.get('/register/', function (req, res) {
    function writeRsvp() {
        fs.writeFile('./rsvp/' + req.query.email, JSON.stringify(req.query), function (err) {
            if (err) {
                throw err;
            }
            console.log("saved rsvp for " + req.query.email);
            res.send('success');
        });
    }

    fs.exists('./rsvp/', function (exists) {
        if (!exists) {
            fs.mkdir('./rsvp/', writeRsvp);
        }
    });
});

var server = app.listen(process.env.PORT || 80, function () {
    var host = server.address().address,
        port = server.address().port;

    console.log('Wedding app listening at http://%s:%s', host, port);
});
