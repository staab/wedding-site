"use strict";

var express = require('express'),
    app = express(),
    fs = require('fs');

app.get('/rsvp/', function (req, res) {
    fs.readFile('./index.html', 'utf-8', function (err, contents) {
        res.send(contents);
    });
});

app.get('/', function (req, res) {
    fs.readFile('./slideshow.html', 'utf-8', function (err, contents) {
        res.send(contents);
    });
});

var staticOptions = {
    dotfiles: 'ignore',
    etag: false,
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now());
    }
};

app.use(express.static('static', staticOptions));
app.use(express.static('bower_components', staticOptions));

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
        } else {
            writeRsvp();
        }
    });
});

var server = app.listen(process.env.PORT || 80, function () {
    var host = server.address().address,
        port = server.address().port;

    console.log('Wedding app listening at http://%s:%s', host, port);
});
