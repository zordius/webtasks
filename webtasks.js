/*jslint node: true */
'use strict';

var express = require('express'),
    exphbs = require('express-handlebars'),
    webtask = require('./lib/webtask'),
    app = module.exports = express();

app.engine('.hbs', exphbs({defaultLayout: false, extname: '.hbs'}));
app.set('view engine', '.hbs');

app.webtask = webtask;

/* istanbul ignore next */
if (!module.parent) {
    app.webtask(require('./pages/sample'));
    app.listen(3000);
    console.log('Webtasks started on port 3000');
}
