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
    // console.log("body: " + util.inspect(req.body));
    // console.log("headers: " + req.headers);
    // console.log("trailers: " + req.trailers);
    // console.log("method: " + req.method);
    // console.log("url: " + req.url);
    // console.log("params: " + util.inspect(req.params));
    // console.log("query: " + util.inspect(req.query));
    // console.log("route: " + req.route);
    // console.log("cookies: " + req.cookies);
    // console.log("ip: " + req.ip);
    // console.log("path: " + req.path);
    // console.log("host: " + req.host);
    // console.log("fresh: " + req.fresh);
    // console.log("stale: " + req.stale);
    // console.log("protocol: " + req.protocol);
    // console.log("secure: " + req.secure);
    // console.log("originalUrl: " + req.originalUrl);
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

    //logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {

     console.log( 'Call activity.js' );

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
            console.log('decoded in arguments: ', decoded.inArguments.length);

            // for(var i = 0; i < decoded.inArguments.length;i++){
            //     console.log('arg ', i , ':', decoded.inArguments[i]);
            // }

            console.log('inArguments: ', decoded.inArguments);
            console.log('URL: ', decoded.inArguments[1].url);
            console.log('Payload: ', decoded.inArguments[2].contentJSON);

            var webhookURL = decoded.inArguments[1].url;
            var contentJSON = decoded.inArguments[2].contentJSON;


            /* Webhook API Call */

            const zapHttps = require('https')

            var zapData = JSON.stringify(contentJSON)

            var zapOptions = {
              hostname: 'hooks.zapier.com',
              port: 443,
              path: '',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            }

            zapOptions['path'] = webhookURL;

            const zapReq = zapHttps.request(zapOptions, resp => {
              console.log(`EXECUTE Zapier Status: ${resp.statusCode}`)

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

    

    /* MC Auth Call */

    // const mcAuthHttps = require('https')

    // const payload = '{"grant_type": "client_credentials","client_id": "5t02s8dmqrx39d98sbuvy8e8","client_secret": "tDkBpuJkty7JDiQSZyWhCumi", "scope": "data_extensions_read data_extensions_write"}';
    // console.log('auth payload: ', payload);
    // const mcAuthData = payload; //JSON.stringify(payload);

    // const mcAuthOptions = {
    //   hostname: 'mcwprj3n0rthz83-y9-d9kx0yrw8.auth.marketingcloudapis.com',
    //   port: 443,
    //   path: '/v2/token/',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }

    // const mcAuthReq = mcAuthHttps.request(mcAuthOptions, resp => {
    //   console.log(`VALIDATE MC Auth Status: ${resp.statusCode}`)

    //   resp.on('data', d => {
    //     console.log(`Data chunk available: ${d}`)
    //     const mcAuthJSONresp = JSON.parse(d);
    //     console.log('Auth Response: ', d);
    //     console.log('access_token: ', mcAuthJSONresp.access_token);
    //     const access_token = mcAuthJSONresp.access_token;
    //   })
    // })

    // mcAuthReq.on('error', error => {
    //   console.error(error)
    // })

    // mcAuthReq.write(mcAuthData)
    // mcAuthReq.end()

    /* MC Log Call */

    // const mcLogHttps = require('https')

    // const logPayload = '[';
    // // logPayload += '{';
    // // logPayload += '    "keys":{';
    // // logPayload += '            "id": "1111"';
    // // logPayload += '            },';
    // // logPayload += '    "values":{';
    // // logPayload += '            "request_id": "awdawdwa",';
    // // logPayload += '            "attempt": "dfefe",';
    // // logPayload += '            "status": "OK",';
    // // logPayload += '            "statusCode": "400"';
    // // logPayload += '            }';
    // // logPayload += '},';
    // // logPayload += '{';
    // // logPayload += '    "keys":{';
    // // logPayload += '            "id": "2222"';
    // // logPayload += '            },';
    // // logPayload += '    "values":{';
    // // logPayload += '            "request_id": "awdawdwa",';
    // // logPayload += '            "attempt": "dfefe",';
    // // logPayload += '            "status": "OK",';
    // // logPayload += '            "statusCode": "400"';
    // // logPayload += '            }';
    // // logPayload += '}';
    // // logPayload += ']';

    // console.log('log payload: ', payload);
    // const mcLogData = payload; //JSON.stringify(payload);

    // const mcLogOptions = {
    //   hostname: 'mcwprj3n0rthz83-y9-d9kx0yrw8.rest.marketingcloudapis.com',
    //   port: 443,
    //   path: '/hub/v1/dataevents/key:whLog/rowset',
    //   method: 'POST',
    //   auth: '', 
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }

    // mcLogOptions['auth'] = 'Bearer' + access_token;
    // console.log('log options: ', mcLogOptions);

    // const mcLogReq = mcLogHttps.request(mcLogOptions, resp => {
    //   console.log(`VALIDATE MC Auth Status: ${resp.statusCode}`)

    //   resp.on('data', d => {
    //     console.log(`Data chunk available: ${d}`)
    //     const mcLogJSONresp = JSON.parse(d);
    //     console.log('Log Response: ', d);
    //     console.log('Log Message: ', mcLogJSONresp.message);
    //   })
    // })

    // mcLogReq.on('error', error => {
    //   console.error(error)
    // })

    // mcLogReq.write(mcLogData)
    // mcLogReq.end()



    //logData(req);
    res.send(200, 'Validate');
};

