/*jslint node: true */
'use strict';

var express = require('express'),
    app = module.exports = express();

app.get('/', function (req, res) {
    res.send('OK! this is a page....');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Webtasks started on port 3000');
}
