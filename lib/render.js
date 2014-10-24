/*jslint node: true */
'use strict';

var exphbs = require('express-handlebars'),
    locate = require('./locate'),
    subtask = require('subtask'),
    hbsObj = exphbs.create({
        defaultLayout: false,
        partialsDir: 'partial',
        extname: '.hbs'
    }),

render = function (R) {
    // Skip rendering
    if (!R) {
        return subtask();
    }

    // Should with view, show message and abort.
    if (!R.view) {
        error('internal error...render() without .view');
        return subtask();
    }

    // Should with data, show message.
    if (R.data === undefined) {
        error('rendering view: "' + R.view + '" with undefined');
    }

    return subtask(function (cb) {
        hbsObj.render('view/' + R.view + '.hbs', R.data).then(function (V) {
            cb(V);
        }, function (E) {
            cb();
            error(E);
        });
    });
};

render.engine = hbsObj.engine;

module.exports = render;
