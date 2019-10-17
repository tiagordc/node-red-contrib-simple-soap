'use strict';

module.exports = function (RED) {

  function SimpleSOAP (config) {

    var request = require("request");
    var xml2js = require('xml2js');
    
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', function(msg, nodeSend, nodeDone) {

        const host = config.host;
        const path = config.path;
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
        reqOpts.encoding = null;
        reqOpts.forever = true;
        reqOpts.body = config.body || msg.payload;

        //credentials...

        request(reqOpts, function(err, response, body) {

            if (err) {
                node.error(err, msg);
                node.status({ fill: "red", shape: "ring", text: err.code });
                nodeDone();
            } 
            else {

                //https://github.com/node-red/node-red/blob/master/packages/node_modules/%40node-red/nodes/core/parsers/70-XML.js

                var reqResult = body.toString('utf8');
                var parseXml = xml2js.parseString;

                var parseOpts = {};
                parseOpts.async = true;
                parseOpts.attrkey = '$';
                parseOpts.charkey = '_';

                parseXml(reqResult, parseOpts, function (parseErr, parseResult) {
                    if (parseErr) { 
                        node.error(parseErr, msg); 
                        node.status({ fill: "red", shape: "ring", text: parseErr });
                        nodeDone();
                    }
                    else {
                        msg.payload = sanitize(parseResult);
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

    function sanitize(message) {
    
        if (typeof message !== 'object') 
            return message;
        
        var keys = Object.keys(message);
        var result = message;
        
        if (keys.length === 1 && keys[0] === '0')
            result = result['0'];  
        
        for (var prop in result) {
            result[prop] = sanitize(result[prop]);
        }
      
        return result;
          
    }

  };

  RED.nodes.registerType("simple-soap", SimpleSOAP);

};