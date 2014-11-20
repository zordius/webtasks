/*jslint node: true */
'use strict';

var cookieparser = require('cookie-parser'),
    webtaskContext = require('./context'),
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
                var O = {
                    view: type + '_' + name,
                    data: R
                };
                return O;
            };
        case 'ajax':
            task = locate(this, name, type);
        }

        return (task && task.apply) ? function (req, res, next) {
            var CX = new webtaskContext(req, res);
            task.apply(CX).transform(trans)
            .transform(type === 'page' ? function (R) {
                R.data.dreact = CX.reactBindStr();
                return R;
            } : undefined)
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
