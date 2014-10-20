/*jslint node: true */
'use strict';

var express = require('express'),
    exphbs = require('express-handlebars'),
    task = require('subtask'),
    app = module.exports = express();

app.engine('.hbs', exphbs({defaultLayout: false, extname: '.hbs'}));
app.set('view engine', '.hbs');

app.webtask = function (name) {
    var T = require(name);

    app.use(function (req, res, next) {
        T({
            req: req,
            res: res
        }).execute(function (R) {
            if (R && R.data) {
                if (R.layout) {
                    res.render(R.layout, R.data);
                } else {
                    res.json(R.data);
                }
            } else {
                next();
            }
        });
    });
};


/* istanbul ignore next */
if (!module.parent) {
    app.webtask('./pages/sample');
    app.listen(3000);
    console.log('Webtasks started on port 3000');
}
