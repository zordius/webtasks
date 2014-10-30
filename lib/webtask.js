/*jslint node: true */
'use strict';

var subtask = require('subtask'),
    browserify = require('browserify-middleware'),
    cookieparser = require('cookie-parser'),
    webtaskContext = require('./context'),
    locate = require('./locate'),
    render = require('./render'),

init = function (app) {
    app.set('views', 'view');
    app.engine('.hbs', render.engine);
    app.set('view engine', '.hbs');
    app.webtask = webtask;
    app.use(cookieparser());

    app.page = locate.appRender(app, 'page');
    app.module = locate.appRender(app, 'module');

    app.ajax = function (name) {
        var T = locate(app, name, 'ajax');

        T._webtaskType = 'ajax';
        T._webtaskName = name;
        return T;
    };
},

middleware = function (task) {
    return function (req, res, next) {
        task.apply(new webtaskContext(req, res)).execute(function (R) {
            if (R) {
                res.send(R);
            } else {
                next();
            }
        });
    };
},

webtask = function () {
    var L = arguments.length - 1,
        task = arguments[L];

    if (!task || !task._webtaskType) {
        return console.error('.webtask() like to take a webtask!');
    }

    switch (task._webtaskType) {
    case 'page':
    case 'module':
    case 'ajax':
        break;
    default:
        return console.error('.webtask() do not accept "' + task._webtaskName + '" because it is a "' + task_webtaskType + '" type webtask');
    }

    L ? this.use(arguments[0], middleware(task)) : this.use(middleware(task));
    return this;
};

webtask.init = init;
webtask.middleware = middleware;

module.exports = webtask;
