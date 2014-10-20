/*jslint node: true */
'use strict';

var task = require('subtask'),

page = function (CX) {
},

amodule = function (name) {
},

data = function (name) {
},

webtask = function (task) {
    this.use(function (req, res, next) {
        task({
            req: req,
            res: res,
            page: page,
            module: amodule,
            data: data
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

module.exports = webtask;
