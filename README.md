# node-red-contrib-simple-soap

The purpose of this project is to preform simple SOAP requests and parse the XML result in a single step.

This project doesn't require WSDL compliance.

## How it works:

Unlike the default HTTP request where the URL is static in the node properties, simple-soap allows to use flow or env variables to define each property.

The SOAPAction header is also populated so there is no need for header customization.

## Future:

Custom headers and authentication coming soon

### To install: 

Install node-red.

Install this package with "npm install node-red-contrib-simple-soap --save" in ~./node-red or via the Palette Manager in node-red.

If everything was successfull you should see the new simple-soap node under the network category.
