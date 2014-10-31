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

        app.pageMiddleware = function (name) {
            return webtask.middleware(locate.appRender(app, 'page'));
        };
        app.moduleMiddleware = function (name) {
            return webtask.middleware(locate.appRender(app, 'module'));
        };
        app.ajaxMiddleware = function (name) {
            return webtask.middleware(locate(app, name, 'ajax'));
        };
    },

    middleware: function (task) {
        if (!task) {
            return;
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
