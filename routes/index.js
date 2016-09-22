var express = require('express');
var router = express.Router();
var Crawler = require("crawler");
var url = require('url');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var city = "Chicago IL";
var state = "IL";
var find = "Barbers";

city=city.replace(/ /g,"%2C+");
var page = 0;
var scrapepage = true;

var scrape_data = {};
var scrape_data_count = 0;
/* GET home page. */
router.get('/', function(req, res, next) {

    while (scrapepage) {
        url = 'https://www.yelp.co.uk/search?find_desc='+find+'&find_loc='+city+''+state+'&start='+page;

        page += 10;

        request(url, function(error, response, html){
          if(!error){
            var $ = cheerio.load(html);

            var title, release, rating;
            var json = { id: "", title : "", link : "", neighborhood : "", address : "", phone : ""};

            $('.biz-name').filter(function(){
                var id = $(this).text();
                json.id = id;
                json.link = id;
            });

            $('.biz-name span').filter(function(){
                var data = $(this).text();
                json.title = data;
            });

            $('.biz-listing-large .secondary-attributes span.neighborhood-str-list').filter(function(){
                var data = $(this);
                json.neighborhood = data;
            });

            $('.biz-listing-large .secondary-attributes address').filter(function(){
                var data = $(this).text();
                json.address = data;
            });

            $('.biz-listing-large .secondary-attributes .biz-phone').filter(function(){
                var phone = $(this).text();
                json.address = phone;
            });

            scrape_data_count++;
            scrape_data[scrape_data_count] = json;
            //console.log(scrape_data);
          }

        })

        if(page == 100){
            scrapepage = false;

            fs.appendFile('output.json', JSON.stringify(scrape_data, null, 4), function(err){
              console.log('File successfully written! - Check your project directory for the output.json file');
            })

            res.send('Check your console!')
        }

      }
});




module.exports = router;
