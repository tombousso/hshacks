#!/bin/env node

var http = require("http");
var url = require("url");
var MongoClient = require('mongodb').MongoClient;
console.log("CONNECTIN");
var pebbles, counter;
MongoClient.connect("mongodb://masteruser:abc@ds033439.mongolab.com:33439/pebblix", function (err, db) {
    if (!err) {
        console.log("We are connected");
    }
    db.collectionNames(function (err, collections) {
        console.log(collections);
    });
    pebbles = db.collection('pebbles');
    counter = db.collection('counter');
});
http.createServer(function (req, res) {
    console.log(req.url);
    var parsedUrl = url.parse(req.url, true);
    var gets = parsedUrl.query;
    var pathname = url.parse(req.url).pathname;
    if (pathname == "/createUser") {
        counter.findOne({}, function (err, document) {
            if (err) {
                res.end("");
                console.log("NULL1");
            } else {
                console.log(document.count);
                console.log(document._id);
                pebbles.insert({
                    "serial": document.count,
                    "top": "{UP}",
                    "mid": " ",
                    "bot": "{DOWN}",
                    "click": "nil"
                }, function (err) {
                    if (err) {
                        console.log(err);
                    };
                });
                res.end(document.count);
                counter.update({}, {
                    $set: {
                        "count": (parseInt(document.count, 10) + 1).toString()
                    }
                }, function (err) {
                    if (err) {
                        console.log(err);
                    };
                });
            }
        });
    } else if (pathname == "/getKeys") {
        pebbles.findOne({
            "serial": gets.serial
        }, function (err, document) {
            if (err) {
                res.end("");
                console.log("NULL2");
            } else {
                res.end(JSON.stringify({
                    "top": document.top,
                    "mid": document.mid,
                    "bot": document.bot
                }));
            }
        });
    } else if (pathname == "/updateKeys") {
        pebbles.update({
            "serial": gets.serial
        }, {
            $set: {
                "top": gets.top,
                "mid": gets.mid,
                "bot": gets.bot
            }
        }, function (err) {
            if (err) {
                console.log(err);
            };
        });
        res.end("Success");
    } else if (pathname == "/click") {
        pebbles.update({
            "serial": gets.serial
        }, {
            $set: {
                "click": gets.button
            }
        }, function (err) {
            if (err) {
                console.log(err);
            };
        });
        res.end("Succcess");
    } else if (pathname == "/clicked") {
        pebbles.findOne({
            "serial": gets.serial
        }, function (err, document) {
            if (err) {
                res.end("");
                console.log("NULL3");
            } else {
                res.end(document.click);
                pebbles.update({
                    "serial": gets.serial
                }, {
                    $set: {
                        "click": "nil"
                    }
                }, function (err) {
                    if (err) {
                        console.log(err);
                    };
                });
            }
        });
    } else {
        res.end("You're lost.")
    }
}).listen(process.env.PORT || 8080);