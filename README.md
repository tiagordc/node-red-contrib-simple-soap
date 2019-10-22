# node-red-contrib-simple-soap

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]

[npm-url]: https://npmjs.org/package/node-red-contrib-simple-soap
[downloads-image]: http://img.shields.io/npm/dm/github-style-page.svg
[npm-image]: http://img.shields.io/npm/v/github-style-page.svg

The purpose of this project is to perform simple SOAP requests and parse the XML result in a single step.

This node doesn't require WSDL compliance as it only executes POST requests to a specific web service endpoint.

## How it works:

Unlike the default HTTP request where the URL is static in the node properties, simple-soap allows to use custom variables to define each property.

The SOAPAction header is also populated so there is no need for header customization.

The output XML can be simplified by removing namespaces and collections if you don't use them.

![node configuration](https://raw.githubusercontent.com/tiagordc/node-red-contrib-simple-soap/master/edit.png)

### Future:

Custom headers and authentication coming soon

## To install: 

Install node-red.

Install this package with "npm install node-red-contrib-simple-soap --save" in ~./node-red or via the Palette Manager in node-red.

If everything was successfull you should see the new simple-soap node under the network category.

https://flows.nodered.org/node/node-red-contrib-simple-soap
