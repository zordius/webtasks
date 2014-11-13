/*jslint node: true */
'use strict';

var exphbs = require('express-handlebars'),
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
        return subtask().error('internal error...render() without .view');
    }

    // Should with data, show message.
    if (R.data === undefined) {
        console.warn('rendering view: "' + R.view + '" with undefined');
    }

    return subtask(function (cb) {
        var thisTask = this;
        hbsObj.render('view/' + R.view + '.hbs', R.data).then(function (V) {
            cb(V);
        }, function (E) {
            thisTask.error(E);
            cb();
        });
    });
};

render.engine = hbsObj.engine;

module.exports = render;
