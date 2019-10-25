# node-red-contrib-simple-soap

![GitHub package.json version](https://img.shields.io/github/package-json/v/tiagordc/node-red-contrib-simple-soap?label=package)
![npm](https://img.shields.io/npm/v/node-red-contrib-simple-soap)
![npm](https://img.shields.io/npm/dm/node-red-contrib-simple-soap)

The purpose of this project is to perform simple SOAP requests and parse the XML result in a single step.

This node doesn't require WSDL compliance as it only executes POST requests to a specific web service endpoint.

Unlike the default HTTP request where the URL is static in the node properties, simple-soap allows to use custom variables to define each property.

The SOAPAction header is also populated so there should be no need for header customization.

The output XML can be simplified with several parsing options available.

To report an issue use the project [GitHub](https://github.com/tiagordc/node-red-contrib-simple-soap/issues) page

## Configuration:

![node configuration](https://raw.githubusercontent.com/tiagordc/node-red-contrib-simple-soap/master/edit.png)

## To install: 

Install [node-red](https://nodered.org/).

Install [this package](https://www.npmjs.com/package/node-red-contrib-simple-soap) with "npm install node-red-contrib-simple-soap --save" in ~./node-red or via the Palette Manager in node-red.

If everything was successfull you should see the new simple-soap node under the network category.

https://flows.nodered.org/node/node-red-contrib-simple-soap
