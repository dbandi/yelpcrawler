var express = require('express');
var router = express.Router();
var Crawler = require("crawler");
var url = require('url');
var fs = require('fs');
var rp = require('request-promise');
var request = require('request');
var cheerio = require('cheerio');

var city = "Chicago IL";
var state = "IL";
var find = "Barbers";

city=city.replace(/ /g,"%2C+");
var page = 0;
var scrapepage = true;
var limitTo = 200;

var scrape_data = {};
var scrape_data_count = 0;

var id = [], title = [], link = [], neighborhood = [], address = [], phone = [], website = [];
var id_count, title_count, link_count, neighborhood_count, address_count, phone_count = [];

router.get('/', function(req, res, next) {

    var contents = fs.readFileSync("output.json");
    var jsonContent = JSON.parse(contents);

    console.log(jsonContent[0]);
    start_scrape(limitTo);

    function start_scrape(limitTo){

        for (var i = 0; i < limitTo; i++) {
            var options = {
                uri: jsonContent[i],
                transform: function (body) {
                    return cheerio.load(body);
                }
            };

            rp(options)
                .then(function ($) {

                    console.log("then");

                    $('h1.biz-page-title').filter(function(){
                        title.push($(this).text());
                        var temp_title = $(this).text();
                        temp_title = temp_title.replace(/(\r\n|\n|\r)/gm,"");
                        scrape_data.title = temp_title.trim();
                    });

                    $('.map-box-address .neighborhood-str-list').filter(function(){
                        neighborhood.push($(this).text());
                        var temp_neighborhood = $(this).text();
                        temp_neighborhood = temp_neighborhood.replace(/(\r\n|\n|\r)/gm,"");
                        scrape_data.neighborhood = temp_neighborhood.trim();
                    });

                    $('.map-box-address address').filter(function(){
                        address.push($(this).find('span[itemprop="streetAddress"]').text() + $(this).find('span[itemprop="addressLocality"]').text() + $(this).find('span[itemprop="addressRegion"]').text() + $(this).find('span[itemprop="postalCode"]').text());
                        var temp_address = $(this).find('span[itemprop="streetAddress"]').text() + $(this).find('span[itemprop="addressLocality"]').text() + $(this).find('span[itemprop="addressRegion"]').text() + $(this).find('span[itemprop="postalCode"]').text();
                        temp_address = temp_address.replace(/(\r\n|\n|\r)/gm,"");
                        scrape_data.address = temp_address.trim();
                    });

                    $('.mapbox .biz-phone').filter(function(){
                        phone.push($(this).text());
                        var temp_phone = $(this).text();
                        temp_phone = temp_phone.replace(/(\r\n|\n|\r)/gm,"");
                        scrape_data.phone = temp_phone.trim();
                    });

                    if(title.length == jsonContent.length){
                        res.send('Crawl Details!');
                    }

                    console.log(temp_title + " " + title.length + ":" + jsonContent.length);

                    //if(title.length == 150){
                        fs.appendFile('crawl.json', JSON.stringify(scrape_data, null, 4), function(err){
                            console.log('File successfully written! - Check your project directory for the output.json file');
                        });

                        console.trace();
                        var randTime = Math.round(Math.random() * (3000 - 500)) + 500;
                        limitTo += 200;
                        setTimeout(start_scrape(limitTo), randTime);

                        if(title.length == jsonContent.length){
                            res.send('Crawl Details!');
                        }

                    //}
                })
                .catch(function (err) {
                    // Crawling failed or Cheerio choked...
                    scrapepage = false;
                });
        }
    }


});

module.exports = router;
