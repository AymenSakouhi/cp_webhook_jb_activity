'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');

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
        host: req.hostname,
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
    //logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    //console.log( 'TEST SAVE' );

    //logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {

    console.log( 'EXECUTE' );

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
        //console.log('decoded in arguments: ', decoded.inArguments.length);

        for(var i = 0; i < decoded.inArguments.length;i++){
            //console.log('arg ', i , ':', decoded.inArguments[i]);
        }

        

          // console.log('inArguments: ', decoded.inArguments);
          // console.log('inURL: ', decoded.inArguments[1].url);
          // console.log('inPayload: ', decoded.inArguments[2].contentJSON);

          var webhookURL = decoded.inArguments[1].url;
          var contentJSON = decoded.inArguments[2].contentJSON;
          var email = decoded.inArguments[3].emailAddress;
          contentJSON = contentJSON.replace(/@email/g, email);
          var firstName = decoded.inArguments[5].firstName;
          contentJSON = contentJSON.replace(/@firstName/g, firstName);
          var phone = decoded.inArguments[6].phone;
          contentJSON = contentJSON.replace(/@phone/g, phone);
          var lastName = decoded.inArguments[7].lastName;
          contentJSON = contentJSON.replace(/@lastName/g, lastName);
          var opportunityId = decoded.inArguments[8].opportunityId;
          contentJSON = contentJSON.replace(/@opportunityId/g, opportunityId);
          var stageName = decoded.inArguments[9].stageName;
          contentJSON = contentJSON.replace(/@stageName/g, stageName);
          var programFamily = decoded.inArguments[10].programFamily;
          contentJSON = contentJSON.replace(/@programFamily/g, programFamily);
          var cpAccountId = decoded.inArguments[11].cpAccountId;
          contentJSON = contentJSON.replace(/@cpAccountId/g, cpAccountId);
          var salutation = decoded.inArguments[12].salutation;
          contentJSON = contentJSON.replace(/@salutation/g, salutation);
          var productName = decoded.inArguments[13].productName;
          contentJSON = contentJSON.replace(/@productName/g, productName);
          var productFamily = decoded.inArguments[14].productFamily;
          contentJSON = contentJSON.replace(/@productFamily/g, productFamily);
          var productId = decoded.inArguments[15].productId;
          contentJSON = contentJSON.replace(/@productId/g, productId);
          var degree = decoded.inArguments[16].degree;
          contentJSON = contentJSON.replace(/@degree/g, degree);
          var createdDate = decoded.inArguments[17].createdDate;
          contentJSON = contentJSON.replace(/@createdDate/g, createdDate);
          var optIn = decoded.inArguments[18].optIn;
          contentJSON = contentJSON.replace(/@optIn/g, optIn);
          var country = decoded.inArguments[19].country;
          contentJSON = contentJSON.replace(/@country/g, country);
          var voucher = decoded.inArguments[20].voucher;
          contentJSON = contentJSON.replace(/@voucher/g, voucher);
          var workExperience = decoded.inArguments[21].workExperience;
          contentJSON = contentJSON.replace(/@workExperience/g, workExperience);
          var budget = decoded.inArguments[22].budget;
          contentJSON = contentJSON.replace(/@budget/g, budget);
          var rate = decoded.inArguments[23].rate;
          contentJSON = contentJSON.replace(/@rate/g, rate);
          var studyAdvisor = decoded.inArguments[24].studyAdvisor;
          contentJSON = contentJSON.replace(/@studyAdvisor/g, studyAdvisor);
          var contactId = decoded.inArguments[25].contactId;
          contentJSON = contentJSON.replace(/@contactId/g, contactId);
          var domain = decoded.inArguments[26].domain;
          var journeyName = decoded.inArguments[27].journeyName;
          var obwKey = decoded.inArguments[31].obwKey;
          contentJSON = contentJSON.replace(/@obwKey/g, obwKey);
          


          //console.log('outPayload: ', contentJSON);

          /* Webhook API Call */

          var edk = decoded.inArguments[28].edk;

          console.log ('edk: ' + edk);

          if (edk != undefined) {

            const zapHttps = require('https')
            var statusCode;

            var zapData = contentJSON;
            // zapData = zapData.replace(/\\n/g, "");
            // zapData = zapData.replace(/\\/g, "");
            // zapData = zapData.substring(1, zapData.length-1);
            var zapResponse;
            console.log('Replaced Payload: ', zapData);

            var zapOptions = {
              hostname: '',
              port: 443,
              path: '',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            }

            zapOptions['path'] = webhookURL;
            zapOptions['hostname'] = domain;
            //console.log('Webhook Options: ', zapOptions)

            const zapReq = zapHttps.request(zapOptions, resp => {
              console.log(`EXECUTE Zapier Status: ${resp.statusCode}`)
              var statusCode = resp.statusCode;


              resp.on('data', d => {

                const zapJSONresp = JSON.parse(d);
                // console.log('id: ', zapJSONresp.id);
                // console.log('request_id: ', zapJSONresp.request_id);
                // console.log('attempt: ', zapJSONresp.attempt);
                // console.log('status: ', zapJSONresp.status);
                zapResponse = JSON.stringify(zapJSONresp);
                //console.log('zapResponse: ', zapResponse);

                // /* MC Auth Call */

                var access_token;

                const mcAuthHttps = require('https')

                const authPayload = '{"grant_type": "client_credentials","client_id": "5t02s8dmqrx39d98sbuvy8e8","client_secret": "tDkBpuJkty7JDiQSZyWhCumi", "scope": "data_extensions_read data_extensions_write"}';
                //console.log('auth payload: ', authPayload);
                const mcAuthData = authPayload; //JSON.stringify(payload);

                const mcAuthOptions = {
                  hostname: 'mcwprj3n0rthz83-y9-d9kx0yrw8.auth.marketingcloudapis.com',
                  port: 443,
                  path: '/v2/token/',
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }

                const mcAuthReq = mcAuthHttps.request(mcAuthOptions, respAuth => {
                  console.log(`EXECUTE MC Auth Status: ${respAuth.statusCode}`)

                  respAuth.on('data', d => {
                    console.log(`Data chunk available: ${d}`)
                    const mcAuthJSONresp = JSON.parse(d);
                    console.log('Auth Response: ', d);
                    //console.log('access_token: ', mcAuthJSONresp.access_token);
                    access_token = mcAuthJSONresp.access_token;

                    const mcLogHttps = require('https')
                    //zapData = zapData.replace(/"/g, "'");
                    zapResponse = JSON.stringify(zapResponse);
                    //console.log('Log zapData: ', zapData);

                    let date_ob = new Date();
                    let date = ("0" + date_ob.getDate()).slice(-2);
                    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                    let year = date_ob.getFullYear();
                    let hours = date_ob.getHours() + 2;
                    let minutes = date_ob.getMinutes();
                    let seconds = date_ob.getSeconds();

                    let fullDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

                    var zapJSON = JSON.parse(zapData); //zapData.replace(/'/g, '"');

                    var logPayload = [
                      {
                        "keys": {
                            "contactId": contactId,
                            "date": fullDate
                        },
                        "values": {
                          
                          "status": statusCode,
                          "payload": zapData,
                          "response": zapResponse,
                          "url": domain + webhookURL,
                          "gender": salutation,
                          "firstName": firstName,
                          "email": email,
                          "phone": phone,
                          "country": country,
                          "opt-in": optIn,
                          "message": zapJSON.message,
                          "programFamily": programFamily,
                          "journeyName": journeyName
                        }
                      }
                    ];

                    console.log('LOG PAYLOAD: ', logPayload);
                    const mcLogData = JSON.stringify(logPayload);

                    const mcLogOptions = {
                      hostname: 'mcwprj3n0rthz83-y9-d9kx0yrw8.rest.marketingcloudapis.com',
                      port: 443,
                      path: '/hub/v1/dataevents/key:whLog/rowset',
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: ''
                      }
                    }

                    //console.log('access_token LOG CALL: ', access_token);
                    mcLogOptions['headers']['Authorization'] = 'Bearer ' + access_token;
                   //console.log('log options: ', mcLogOptions);

                    const mcLogReq = mcLogHttps.request(mcLogOptions, respLog => {
                      console.log(`EXECUTE MC LOG Status: ${respLog.statusCode}`)

                      respLog.on('data', d => {
                        //console.log(`Data chunk available: ${d}`)
                        const mcLogJSONresp = JSON.parse(d);
                        console.log('Log Response: ', respLog.statusCode);
                      })
                    })

                    mcLogReq.on('error', error => {
                      console.error(error)
                    })

                    mcLogReq.write(mcLogData.toString())
                    mcLogReq.end()    

                  
                  })
                })

                mcAuthReq.on('error', error => {
                  console.error(error)
                })

                mcAuthReq.write(mcAuthData)
                mcAuthReq.end()

              })
            })

            zapReq.on('error', error => {
              console.error(error)
            })

            zapReq.write(zapData)
            zapReq.end()

          }

          else {

            var access_token;

              const mcAuthHttps = require('https')

              const authPayload = '{"grant_type": "client_credentials","client_id": "5t02s8dmqrx39d98sbuvy8e8","client_secret": "tDkBpuJkty7JDiQSZyWhCumi", "scope": "data_extensions_read data_extensions_write"}';
              //console.log('auth payload: ', authPayload);
              const mcAuthData = authPayload; //JSON.stringify(payload);

              const mcAuthOptions = {
                hostname: 'mcwprj3n0rthz83-y9-d9kx0yrw8.auth.marketingcloudapis.com',
                port: 443,
                path: '/v2/token/',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                }
              }

              const mcAuthReq = mcAuthHttps.request(mcAuthOptions, respAuth => {
                console.log(`EXECUTE MC Auth Status: ${respAuth.statusCode}`)

                respAuth.on('data', d => {
                  console.log(`Data chunk available: ${d}`)
                  const mcAuthJSONresp = JSON.parse(d);
                  console.log('Auth Response: ', d);
                  //console.log('access_token: ', mcAuthJSONresp.access_token);
                  access_token = mcAuthJSONresp.access_token;

                  const mcLogHttps = require('https')

                  let date_ob = new Date();
                  let date = ("0" + date_ob.getDate()).slice(-2);
                  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                  let year = date_ob.getFullYear();
                  let hours = date_ob.getHours() + 2;
                  let minutes = date_ob.getMinutes();
                  let seconds = date_ob.getSeconds();

                  let fullDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
                  var zapData = contentJSON;

                  var zapJSON = JSON.parse(zapData); //zapData.replace(/'/g, '"');

                  var logPayload = [
                    {
                      "keys": {
                          "contactId": contactId,
                          "date": fullDate
                      },
                      "values": {
                        
                        "status": "400",
                        "payload": zapData,
                        "response": "undefined Entry",
                        "url": domain + webhookURL,
                        "gender": salutation,
                        "firstName": firstName,
                        "email": email,
                        "phone": phone,
                        "country": country,
                        "opt-in": optIn,
                        "message": zapJSON.message,
                        "programFamily": programFamily,
                        "journeyName": journeyName
                      }
                    }
                  ];

                  console.log('LOG PAYLOAD: ', logPayload);
                  const mcLogData = JSON.stringify(logPayload);

                  const mcLogOptions = {
                    hostname: 'mcwprj3n0rthz83-y9-d9kx0yrw8.rest.marketingcloudapis.com',
                    port: 443,
                    path: '/hub/v1/dataevents/key:whLog/rowset',
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: ''
                    }
                  }

                  //console.log('access_token LOG CALL: ', access_token);
                  mcLogOptions['headers']['Authorization'] = 'Bearer ' + access_token;
                  //console.log('log options: ', mcLogOptions);

                  const mcLogReq = mcLogHttps.request(mcLogOptions, respLog => {
                    console.log(`EXECUTE MC LOG Status: ${respLog.statusCode}`)

                    respLog.on('data', d => {
                      //console.log(`Data chunk available: ${d}`)
                      const mcLogJSONresp = JSON.parse(d);
                      console.log('Log Response: ', respLog.statusCode);
                      console.log('Log Message: ', respLog.content);
                    })
                  })

                  mcLogReq.on('error', error => {
                    console.error(error)
                  })

                  mcLogReq.write(mcLogData.toString())
                  mcLogReq.end()    

                  
                })
              })

              mcAuthReq.on('error', error => {
                console.error(error)
              })

              mcAuthReq.write(mcAuthData)
              mcAuthReq.end()
          }
          
          
          
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
    //console.log( JSON.stringify(req.body) );
    console.log( 'VALIDATE' );
    // JWT(req.body, process.env.jwtSecret, (err, decoded) => {

    //   console.log( 'VALIDATE 2' );
    //     // verification error -> unauthorized request
    //     if (err) {
    //         console.error(err);
    //         return res.status(401).end();
    //     }
    //     console.log( 'DECODED ' + JSON.stringify(decoded ));
    //     console.log('decoded in arguments: ', decoded.inArguments.length);

    //         for(var i = 0; i < decoded.inArguments.length;i++){
    //             console.log('arg ', i , ':', decoded.inArguments[i]);
    //         }

            

    //     if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            
    //         // decoded in arguments
    //         var decodedArgs = decoded.inArguments[0];
    //         //console.log('decoded in arguments: ', decoded.inArguments.length);

    //         for(var i = 0; i < decoded.inArguments.length;i++){
    //             console.log('val arg ', i , ':', decoded.inArguments[i]);
    //         }

    //         // console.log('inArguments: ', decoded.inArguments);
    //         // console.log('inURL: ', decoded.inArguments[1].url);
    //         // console.log('inPayload: ', decoded.inArguments[2].contentJSON);

            
    //         var edk = decoded.inArguments[28].edk;

    //         console.log( 'VALIDATION EDK' + edk);

    //         if (edk !== "undefined") {
              
    //         } else {
    //           console.error('no entry event defined');
    //           return res.status(400).end('No Entry Event');
    //         }
            
    //     } else {
    //         console.error('inArguments invalid.');
    //         return res.status(400).end();
    //     }
    // });

    res.send(200, 'Validate');

};

