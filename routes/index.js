var express = require('express');
var router = express.Router();

var fs = require('fs');

var Geocoder = require('node-geocoder');
var geocoder = Geocoder.getGeocoder('google', 'http');

var geolib = require('geolib');

var utils = require('../utils.js');

function handleMapping(start, end, callback) {
    var i = 0;
    var x1 = start.latitude;
    var y1 = start.longitude;
    var x2 = end.latitude;
    var y2 = end.longitude;
    var result = [];
    function processZipCode(zip) {
        var polygons = zip.geometry.coordinates;
        var type = zip.geometry.type;
        if(type === 'Polygon') {
            polygons = [polygons];
        }
        polygons.forEach(function(shape) {
            // Each zipcode might have many polygons so each needs to be included
            var intersects = false;

            //remove extraneous nesting
            points = shape[0];

            for(var i = 0; i < points.length-1; i++) {
                var x3 = points[i][1];
                var y3 = points[i][0];
                var x4 = points[i+1][1];
                var y4 = points[i+1][0];
                if(utils.lineIntersects(x1, y1, x2, y2, x3, y3, x4, y4)) {
                    intersects = true;
                }
            }
            if(intersects) {
                result.push(points);
            }
        });
    }
    function terminate() {
        callback(result);
    }
    utils.readFile('./texas.json', processZipCode, terminate);
}

router.get('/', function(req, res) {
    res.render('index');
})

router.post('/submit', function(req, res) {
    var address1 = req.body.address1;
    var address2 = req.body.address2;
    geocoder.geocode(address1, function(err, res1) {
        geocoder.geocode(address2, function(err, res2) {
            start = {
                latitude: parseFloat(res1[0].latitude),
                longitude: parseFloat(res1[0].longitude)
            };
            end = {
                latitude: parseFloat(res2[0].latitude),
                longitude: parseFloat(res2[0].longitude)
            };
            handleMapping(start, end, function(shapes) {
                var joined = {
                    start: start,
                    end: end,
                    center: geolib.getCenter([start, end]),
                    shapes: shapes
                };
                res.render('map', joined);
            });
        });
    });
});
module.exports = router;
