/*jslint node: true */
'use strict';

var express = require('express'),
    webtask = require('./lib/webtask'),
    app = module.exports = express();

webtask.init(app);

/* istanbul ignore next */
if (!module.parent) {
    app.webtask('/', app.page('sample2'));
    app.webtask('/module/header', app.module('header'));
    app.webtask('/ajax/product', app.ajax('getProduct'));
    app.listen(3000);
    console.log('Webtasks started on port 3000');
}
