/*jslint node: true */
'use strict';

var express = require('express'),
    webtask = require('./lib/webtask'),
    app = module.exports = express();

webtask.init(app);
require('node-jsx').install({extension: '.jsx'});

/* istanbul ignore next */
if (!module.parent) {
    app
    .webtask('/module/header', app.module('header'))
    .webtask('/ajax/product', app.ajax('getProduct'))
    .webtask('/1', app.page('sample1'))
    .webtask('/2', app.page('sample2'))
    .webtask('/3', app.page('sample3'))
    .listen(3000);
    console.log('Webtasks started on port 3000');
}
