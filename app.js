'use strict'

var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var app = express();
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'twitter'
});
connection.connect(function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Connected to the database.');

    app.listen(8080, '0.0.0.0', function() {
        console.log('web server listening on port 8080!');
    });
});

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    var query = 'select * from Tweets order by created_at desc';

    connection.query(query, function(err, results) {
        if (err) {
            console.log(err);
        }
        results.forEach(function(result) {
             result.time_from_now = moment(result.created_at).fromNow();
        });

        res.render('tweets', {tweets: results});
    });
});

app.get('/tweets/:id([0-9]+)/edit', function(req, res) {
    var query = 'select * from Tweets where id = ?';
    var id = req.params.id;

    connection.query(query, [id], function(err, results) {
        if (err || results.length === 0) {
            console.log(err || 'No tweet found.');
            res.redirect('/');
            return;
        }
        var tweet = results[0];
        tweet.time_from_now = moment(tweet.created_at).fromNow();
        res.render('edit-tweet', {tweet: tweet});
    })
});

app.post('/tweets/:id([0-9]+)/update', function(req, res) {
    var updateQuery = 'update Tweets set body = ?, handle = ? where id = ?';
    var deleteQuery = 'delete from Tweets where id = ?';
    var id = req.params.id;
    var handle = req.body.handle;
    var body = req.body.body;
    var isDelete = req.body.delete_button !== undefined;
    var queryCallback = function(err) {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    }

    if (isDelete) {
        connection.query(deleteQuery, [id], queryCallback);
    } else {
        connection.query(updateQuery, [body, handle, id], queryCallback);
    }
});

app.post('/tweets/create', function(req, res) {
    var query = 'insert into Tweets(handle, body) values(?, ?)';
    var handle = req.body.handle;
    var body = req.body.body;

    connection.query(query, [handle, body], function(err) {
        if (err) {
            console.log(err);
        }

        res.redirect('/');
    });
});
