'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');

console.log( 'TEST LOAD ACTIVITY' );

exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    console.log( req.body );
    console.log( 'TEST SAVE' );

    var http1 = require('http');

    http1.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
      resp.on('data', function(ip) {
        console.log("SAVE My public IP address is: " + ip);
      });
    });

    const https = require('https')

    const data = JSON.stringify({
      todo: 'Buy the milk'
    })

    const options = {
      hostname: 'hooks.zapier.com',
      port: 443,
      path: '/hooks/catch/9270658/boao9sj/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const zapReq = https.request(options, resp => {
      console.log(` SAVE Zapier Status: ${resp.statusCode}`)

      resp.on('data', d => {
        process.stdout.write(d)
      })
    })

    zapReq.on('error', error => {
      console.error(error)
    })

    zapReq.write(data)
    zapReq.end()

    logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {

    // example on how to decode JWT
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {


        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            
            // decoded in arguments
            var decodedArgs = decoded.inArguments[0];
            
            logData(req);
            res.send(200, 'Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    console.log( req.body );
    console.log( 'TEST VALIDATE' );

    const https = require('https')

    const data = JSON.stringify({
      todo: 'Buy the milk'
    })

    const options = {
      hostname: 'hooks.zapier.com',
      port: 443,
      path: '/hooks/catch/9270658/boao9sj/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const zapReq = https.request(options, resp => {
      console.log(`VALIDATE Zapier Status: ${resp.statusCode}`)

      resp.on('data', d => {
        process.stdout.write(d)
        console.log('Body: ', JSON.parse(data));
      })
    })

    zapReq.on('error', error => {
      console.error(error)
    })

    zapReq.write(data)
    zapReq.end()

    var http = require('http');

        http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
          resp.on('data', function(ip) {
            console.log("VALIDATE My public IP address is: " + ip);
          });
        });
    logData(req);
    res.send(200, 'Validate');
};