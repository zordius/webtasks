/*jslint node: true */
'use strict';

var request_id = 0,
    subtask = require('subtask'),

webtaskContext = function (req, res) {
    this.request_id = ++request_id;
    this.taskPool = {
        req: req,
        res: res
    };
};

webtaskContext.prototype = {
    cookie: function (name) {
        return subtask(this.taskPool.req.cookies[name]);
    },
    query: function (name) {
        return subtask(this.taskPool.req.query[name]);
    },
    param: function (name) {
        return subtask(this.taskPool.req.params[name]);
    },
    data: function (name) {
        return locateForRequestWithCachePool(this, name, 'data');
    },
    module: function (name) {
        return locateForRequestWithRender.apply(this, [name, 'module']);
    },
    page: function (name) {
        return locateForRequestWithRender.apply(this, [name, 'page']);
    },
    task: subtask
};

module.exports = webtaskContext;
