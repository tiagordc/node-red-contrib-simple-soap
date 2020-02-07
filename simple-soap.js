'use strict';

module.exports = function (RED) {

    var request = require("request");
    var mustache = require("mustache");

    function SimpleSOAP(config) {

        RED.nodes.createNode(this, config);

        const node = this;

        node.on('input', function (msg, nodeSend, nodeDone) {

            //https://github.com/node-red/node-red/blob/master/packages/node_modules/%40node-red/nodes/core/common/20-inject.js

            let host = config.host;

            if (config.hostType === 'msg' || config.hostType === 'flow' || config.hostType === 'global') {
                host = RED.util.evaluateNodeProperty(config.host, config.hostType, this, msg);
            }

            let path = config.path;

            if (config.pathType === 'msg' || config.pathType === 'flow' || config.pathType === 'global') {
                path = RED.util.evaluateNodeProperty(config.path, config.pathType, this, msg);
            }

            let action = config.action;

            if (config.actionType === 'msg' || config.actionType === 'flow' || config.actionType === 'global') {
                action = RED.util.evaluateNodeProperty(config.action, config.actionType, this, msg);
            }

            let reqBody = config.body;

            if (config.bodyType === 'msg' || config.bodyType === 'flow' || config.bodyType === 'global') {
                reqBody = RED.util.evaluateNodeProperty(config.body, config.bodyType, this, msg);
            }

            if (config.mustache) {
                const nodeContext = node.context();
                var view = { msg: msg, flow: {}, global: {} };
                nodeContext.flow.keys().forEach((e) => view.flow[e] = nodeContext.flow.get(e));
                nodeContext.global.keys().forEach((e) => view.global[e] = nodeContext.global.get(e));
                reqBody = mustache.render(reqBody, view);
            }

            msg.topic = msg.topic || config.topic;

            //https://github.com/node-red/node-red/blob/master/packages/node_modules/%40node-red/nodes/core/network/21-httprequest.js

            let reqOpts = {};
            reqOpts.method = "POST"; //assumption: only POST requests

            reqOpts.url = host;

            if (path) {
                reqOpts.url = reqOpts.url.replace(/\/$/g, '');
                reqOpts.url += '/';
                reqOpts.url += path.replace(/^\//g, '');
            }

            reqOpts.headers = {};
            reqOpts.headers['Content-Type'] = 'text/xml;charset=UTF-8';
            reqOpts.headers['SOAPAction'] = `"${action}"`;
            reqOpts.encoding = null;
            reqOpts.forever = true;
            reqOpts.body = reqBody;

            if (config.useAuth && node.credentials) {
                reqOpts.auth = {
                    user: node.credentials.user,
                    pass: node.credentials.password || ""
                };
            }

            request(reqOpts, function (err, response, body) {

                if (err) {
                    node.error(err, msg);
                    node.status({ fill: "red", shape: "ring", text: err.code });
					if(nodeDone){
						nodeDone();
					}
                }
                else {

                    //https://github.com/node-red/node-red/blob/master/packages/node_modules/%40node-red/nodes/core/parsers/70-XML.js

                    var xml2js = require('xml2js');
                    var reqResult = body.toString('utf8');
                    var parseXml = xml2js.parseString;

                    var parseOpts = {
                        async: true,
                        attrkey: (config.attrkey || '$'),
                        charkey: (config.charkey || '_'),
                        explicitArray: config.simplify,
                        normalizeTags: config.normalizeTags,
                        normalize: config.normalize
                    };

                    if (config.stripPrefix) {
                        var stripPrefix = require('xml2js').processors.stripPrefix;
                        parseOpts.tagNameProcessors = [stripPrefix];
                        parseOpts.attrNameProcessors = [stripPrefix];
                    }

                    parseXml(reqResult, parseOpts, function (parseErr, parseResult) {
                        if (parseErr) {
                            node.error(parseErr, msg);
                            node.status({ fill: "red", shape: "ring", text: parseErr });
							if(nodeDone){
								nodeDone();
							}
                        }
                        else {
                            msg.payload = parseResult;
                            node.status({});
                            if(nodeSend){
								nodeSend(msg);
							} else {
								node.send(msg);
							}
							if(nodeDone){
								nodeDone();
							}
                        }
                    });

                }

            });

        });

        node.on("close", function () {
            node.status({});
        });

    };

    RED.nodes.registerType("simple-soap", SimpleSOAP, {
        credentials: {
            user: {type:"text"},
            password: {type: "password"}
        }
    });

};