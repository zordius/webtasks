/*jslint node: true */
'use strict';

var express = require('express'),
    exphbs = require('express-handlebars'),
    app = module.exports = express();

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.get('/', function (req, res) {
    res.render('index', {title: 'test title'});
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Webtasks started on port 3000');
}
