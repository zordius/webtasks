/*jslint node: true */
'use strict';

var cookieparser = require('cookie-parser'),
    webtaskContext = require('./context'),
    subtask = require('subtask'),
    render = require('./render'),
    locate = require('./locate'),

webtask = {
    init: function (app) {
        app.use(cookieparser());
        app.middleware = webtask.middleware;
    },

    middleware: function (type, name) {
        var task,
            trans,
            pipe;

        switch (type) {
        case 'page':
        case 'module':
            pipe = render;
            trans = function (R) {
                return {
                    view: type + '_' + name,
                    data: R
                };
            };
        case 'ajax':
            task = locate(this, name, type);
        }

        return task ? function (req, res, next) {
            task.apply(new webtaskContext(req, res))
            .transform(trans)
            .pipe(pipe)
            .execute(function (R) {
                // for devel debug, later remove....
                if (this.errors.length) {
                    this.errors.forEach(function (E) {
                        console.error(E.stack);
                    });
                }
                if (R) {
                    res.send(R);
                } else {
                    next();
                }
            });
        } : undefined;
    }
};

module.exports = webtask;
