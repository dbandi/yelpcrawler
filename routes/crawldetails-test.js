var express = require('express');
var router = express.Router();
var Crawler = require("crawler");
var url = require('url');
var fs = require('fs');
var rp = require('request-promise');
var request = require('request');
var cheerio = require('cheerio');

var Requester = require('requester'),
    requester = new Requester({debug: 1});

var city = "Chicago IL";
var state = "IL";
var find = "Barbers";

city=city.replace(/ /g,"%2C+");
var page = 0;
var scrapepage = true;

var scrape_data = {};
var scrape_data_count = 0;

var id = [], title = [], link = [], neighborhood = [], address = [], phone = [], website = [];
var id_count, title_count, link_count, neighborhood_count, address_count, phone_count = [];

router.get('/', function(req, res, next) {

    var Requester = ('requester');

    var requester = new Requester({
        cookiejar: true, // basic cookie support, currently doesnt care about domain or path rules
        cookies: {},
        headers: {},
        timeout: 4000,
        retries: 3,
        dataType: 'RAW',
        auth: {username: 'username', password: 'password'}, // basic auth for all requests
        proxies: [{ip: '127.0.0.1', port: 1337}, {ip: '127.0.0.2', port: 1337}, {ip: '127.0.0.3', port: 1337}] // rotating proxy array
    });

    var options = {
        encoding: 'binary',
        data: {foo: 'bar'},
        cookies: {foo: 'bar'},
        auth: {username: 'username', password: 'password'} // basic auth for request
    };

    var contents = fs.readFileSync("output.json");
    var jsonContent = JSON.parse(contents);

    requester.get(jsonContent[0], options, function (body) {
        console.log(body);
    });
});

module.exports = router;
