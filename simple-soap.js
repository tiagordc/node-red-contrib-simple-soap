'use strict';

module.exports = function (RED) {

  function SimpleSOAP (config) {

    var request = require("request");
    var xml2js = require('xml2js');
    
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', function(msg, nodeSend, nodeDone) {

        const host = config.host;
        const path = confing.path;
        const action = config.action;

        msg.topic = msg.topic || config.topic;

        //https://github.com/node-red/node-red/blob/master/packages/node_modules/%40node-red/nodes/core/network/21-httprequest.js

        let reqOpts = {};
        reqOpts.method = "POST"; //assumption: only POST requests

        reqOpts.url = host;

        if (path) {
            reqOpts.url += path;
        }

        reqOpts.headers = {};
        reqOpts.headers['Content-Type'] = 'text/xml;charset=UTF-8';
        reqOpts.headers['SOAPAction'] = `"${action}"`;

        reqOpts.encoding = null;  // Force NodeJs to return a Buffer (instead of a string)
        reqOpts.forever = true;

        //credentials...

        request(reqOpts, function(err, response, body) {

            if (err) {
                node.error(err, msg);
                node.status({ fill: "red", shape: "ring", text: err.code });
                nodeDone();
            } 
            else {

                //https://github.com/node-red/node-red/blob/master/packages/node_modules/%40node-red/nodes/core/parsers/70-XML.js

                var reqResult = body.payload.toString('utf8');
                var parseString = xml2js.parseString;

                var parseOpts = {};
                parseOpts.async = true;
                parseOpts.attrkey = '$';
                parseOpts.charkey = '_';

                parseString(reqResult, parseOpts, function (parseErr, parseResult) {
                    if (parseErr) { 
                        node.error(parseErr, msg); 
                        node.status({ fill: "red", shape: "ring", text: parseErr });
                        nodeDone();
                    }
                    else {
                        msg.payload = parseResult;
                        node.status({});
                        nodeSend(msg);
                        nodeDone();
                    }
                });

            }
            
        });

    });

    node.on("close",function() {
        node.status({});
    });

  };

  RED.nodes.registerType("simple-soap", SimpleSOAP);

};