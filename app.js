const express = require('express');
const reqp = require('request-promise');
const { join } = require('path');
const { parse } = require('parse5');


const app = express();

app.use(express.static(join(__dirname, 'public')));

app.use('/tree', handlePageRequest);

function handlePageRequest (request, response, next) {
    let url = request.query.url;
    //TODO: Check that it is a URL
    reqp(url).then(
        function (content) {
            response.json(structureFromHTML(content));
        }
    ).catch(console.log);
}

function structureFromHTML(html) {
    let tree = parse(html);
    return structureFromDOM(tree);
}

function structureFromDOM(tree) {
    let result  = { name: tree.nodeName, children: []};
    if ( tree.childNodes ) {
        //TODO: Optimize later
        result.children = tree.childNodes.map(structureFromDOM);
    }
    return result;
}

module.exports = app;












