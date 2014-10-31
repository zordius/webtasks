/*jslint node: true */
'use strict';

var subtask = require('subtask'),
    browserify = require('browserify-middleware'),
    cookieparser = require('cookie-parser'),
    webtaskContext = require('./context'),
    locate = require('./locate'),
    render = require('./render'),

webtask = {
    init: function (app) {
        app.use(cookieparser());
        app.middleware = webtask.middleware;
    },

    middleware: function (type, name) {
        var task;

        switch (type) {
        case 'page':
        case 'module':
            task = locate.appRender(this, type);
            break;
        case 'ajax':
            task = locate(this, name, type);
        }

        return function (req, res, next) {
            task.apply(new webtaskContext(req, res)).execute(function (R) {
                if (R) {
                    res.send(R);
                } else {
                    next();
                }
            });
        };
    }
};

module.exports = webtask;
