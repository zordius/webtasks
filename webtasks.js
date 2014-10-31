/*jslint node: true */
'use strict';

var express = require('express'),
    webtask = require('./lib/webtask'),
    browserify = require('browserify-middleware'),
    app = module.exports = express();

webtask.init(app);
require('node-jsx').install({extension: '.jsx'});

/* istanbul ignore next */
if (!module.parent) {
    app
    .use('/static', express.static(__dirname + '/static'))
    .use('/module/header', app.moduleMiddleware('header'))
    .use('/ajax/product', app.ajaxMiddleware('getProduct'))
    .use('/1', app.pageMiddleware('sample1'))
    .use('/2', app.pageMiddleware('sample2'))
    .use('/3', app.pageMiddleware('sample3'))
    .listen(3000);
    console.log('Webtasks started on port 3000');
}
