/*jslint node: true */
'use strict';

var subtask = require('subtask'),
    exphbs = require('express-handlebars'),
    cookieparser = require('cookie-parser'),
    webtaskContext = require('./context'),
    locate = require('./locate'),
    render = require('./render'),
    path = require('path'),
    fs = require('fs'),

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

        T._webtaskType = base;
        T._webtaskName = name;
        return T;
    };
},

error = function (O) {
    console.error(O);
},

getMiddleWare = function (task) {
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

webtask = function (task) {
    if (!task || !task._webtaskType) {
        return error('.webtask() like to take a webtask!');
    }

    switch (task._webtaskType) {
    case 'page':
    case 'module':
    case 'ajax':
        break;
    default:
        return error('.webtask() do not accept "' + task._webtaskName + '" because it is a "' + task_webtaskType + '" type webtask');
    }

    this.use(getMiddleWare(task));
};

webtask.init = init;

module.exports = webtask;
