var express = require('express');
var router = express.Router();
var Crawler = require("crawler");
var url = require('url');
var fs      = require('fs');
var rp = require('request-promise');
var request = require('request');
var cheerio = require('cheerio');

var city = "Chicago IL";
var find = "Barbers";

city=city.replace(/ /g,",+");
var page = 0;
var scrapepage = true;
var scrapepagescount = 100;

var scrape_data = {};
var scrape_data_count = 0;

var id = [], title = [], link = [], neighborhood = [], address = [], phone = [];
var id_count, title_count, link_count, neighborhood_count, address_count, phone_count = [];

router.get('/', function(req, res, next) {

    var cheerio = require('cheerio'); // Basically jQuery for node.js

    var init = {
        uri: 'https://www.yelp.co.uk/search?find_desc='+find+'&find_loc='+city+''+'&start='+page,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    rp(init)
        .then(function ($) {

            $('.pagination-results-window').filter(function(){
                scrapepagescount = Math.floor(($(this).text().trim().split(" ").pop()) / 10) * 10;
                console.log(scrapepagescount);
                /*if(scrapepagescount > 990){
                    scrapepagescount = 990;
                }*/
            });

            while (scrapepage) {

                var options = {
                    uri: 'https://www.yelp.co.uk/search?find_desc='+find+'&find_loc='+city+''+'&start='+page,
                    transform: function (body) {
                        return cheerio.load(body);
                    }
                };

                page += 10;

                rp(options)
                    .then(function ($) {

                        $('.biz-name').filter(function(){
                            var biz_id = $(this).attr('href');
                            link.push('https://www.yelp.co.uk' + biz_id);

                            id.push(biz_id.replace('/biz/',''));
                        });

                        scrape_data = link;

                        fs.writeFile('output.json', JSON.stringify(scrape_data, null, 4), function(err){
                            console.log('File successfully written! - Check your project directory for the output.json file');
                        });

                        res.send('Go to Crawl Details!')
                    })
                    .catch(function (err) {
                        // Crawling failed or Cheerio choked...
                        scrapepage = false;
                    });

                    if(page == scrapepagescount){
                        scrapepage = false;
                    }
            }
        })
        .catch(function (err) {
            // Crawling failed or Cheerio choked...
            scrapepage = false;
        });

});




module.exports = router;
