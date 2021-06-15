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

    /* Webhook API Call */

    const zapHttps = require('https')

    const zapData = JSON.stringify({
      todo: 'Buy the milk'
    })

    const zapOptions = {
      hostname: 'hooks.zapier.com',
      port: 443,
      path: '/hooks/catch/9270658/boao9sj/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const zapReq = zapHttps.request(zapOptions, resp => {
      console.log(`VALIDATE Zapier Status: ${resp.statusCode}`)

      resp.on('data', d => {
        const zapJSONresp = JSON.parse(d);
        console.log('id: ', zapJSONresp.id);
        console.log('request_id: ', zapJSONresp.request_id);
        console.log('attempt: ', zapJSONresp.attempt);
        console.log('status: ', zapJSONresp.status);
      })
    })

    zapReq.on('error', error => {
      console.error(error)
    })

    zapReq.write(zapData)
    zapReq.end()

    /* MC Auth Call */

    const acessToken = '';

    const mcAuthHttps = require('https')

    const payload = '{"grant_type": "client_credentials","client_id": "5t02s8dmqrx39d98sbuvy8e8","client_secret": ';
    payload += '"tDkBpuJkty7JDiQSZyWhCumi", "scope": "data_extensions_read data_extensions_write"}';
    console.log('auth payload: ', payload);
    const mcAuthData = payload; //JSON.stringify(payload);

    const mcAuthOptions = {
      hostname: 'mcwprj3n0rthz83-y9-d9kx0yrw8.auth.marketingcloudapis.com',
      port: 443,
      path: '/v2/token/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const mcAuthReq = mcAuthHttps.request(mcAuthOptions, resp => {
      console.log(`VALIDATE MC Auth Status: ${resp.statusCode}`)

      resp.on('data', d => {
        console.log(`Data chunk available: ${d}`)
        const mcAuthJSONresp = JSON.parse(d);
        console.log('Auth Response: ', d);
        console.log('access_token: ', mcAuthJSONresp.access_token);
        access_token = mcAuthJSONresp.access_token;
      })
    })

    mcAuthReq.on('error', error => {
      console.error(error)
    })

    mcAuthReq.write(mcAuthData)
    mcAuthReq.end()

    /* MC Log Call */

    const mcLogHttps = require('https')

    const logPayload = '[
    {
        "keys":{
                "id": "1111"
                },
        "values":{
                "request_id": "awdawdwa",
                "attempt": "dfefe",
                "status": "OK",
                "statusCode": "400"
                }
    },
    {
        "keys":{
                "id": "2222"
                },
        "values":{
                "request_id": "awdawdwa",
                "attempt": "dfefe",
                "status": "OK",
                "statusCode": "400"
                }
    },
    ]  ';
    console.log('auth payload: ', payload);
    const mcLogData = payload; //JSON.stringify(payload);

    const mcLogOptions = {
      hostname: 'mcwprj3n0rthz83-y9-d9kx0yrw8.rest.marketingcloudapis.com',
      port: 443,
      path: '/hub/v1/dataevents/key:whLog/rowset',
      method: 'POST',
      auth: 'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjQiLCJ2ZXIiOiIxIiwidHlwIjoiSldUIn0.eyJhY2Nlc3NfdG9rZW4iOiJaQW5aZTZ2czJpWDIyWGJmR3JzQkZnZTIiLCJjbGllbnRfaWQiOiI1dDAyczhkbXFyeDM5ZDk4c2J1dnk4ZTgiLCJlaWQiOjEwMDAwMjU1Miwic3RhY2tfa2V5IjoiUzEwIiwicGxhdGZvcm1fdmVyc2lvbiI6MiwiY2xpZW50X3R5cGUiOiJTZXJ2ZXJUb1NlcnZlciJ9.83cre9sppV63qsVViPjo72Gs8hN2Ami-ZNXpIKvyCX4.E-S_jDBvFr-qEm8uLwY1oBZvX0f0oKyHEUI9uPTcIN37DyVflHsYZWnKzDr8wW_tOYPgPOpCznI4OHvuMl7KzvKRMx_h1QybV_reKdNxilDST35w--PzuEGyJ1sAKjIK__5Iao1PC2N3ReTwY6Sexq0qG-LgWdIPnnreLq6wmi3H1CnVKSD', 
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const mcLogReq = mcLogHttps.request(mcLogOptions, resp => {
      console.log(`VALIDATE MC Auth Status: ${resp.statusCode}`)

      resp.on('data', d => {
        console.log(`Data chunk available: ${d}`)
        const mcLogJSONresp = JSON.parse(d);
        console.log('Log Response: ', d);
        console.log('Log Message: ', mcLogJSONresp.message);
      })
    })

    mcLogReq.on('error', error => {
      console.error(error)
    })

    mcLogReq.write(mcLogData)
    mcLogReq.end()



    logData(req);
    res.send(200, 'Validate');
};