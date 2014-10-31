/*jslint node: true */
'use strict';

var express = require('express'),
    webtask = require('./lib/webtask'),
    testlib = require('./lib/test'),
    app = module.exports = express();

webtask.init(app);
require('node-jsx').install({extension: '.jsx'});

/* istanbul ignore next */
if (!module.parent) {
    app
    .use('/static', express.static(__dirname + '/static'))
    .use('/module/header', app.middleware('module', 'header'))
    .use('/ajax/product', app.middleware('ajax', 'getProduct'))
    .use('/1', app.middleware('page', 'sample'))
    .use('/2', app.middleware('page', 'sample2'))
    .use('/3', app.middleware('page', 'sample3'))
    .listen(3000);
    console.log('Webtasks started on port 3000');
}
