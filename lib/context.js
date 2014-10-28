/*jslint node: true */
'use strict';

var request_id = 0,
    locate = require('./locate'),
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
        return locate.contextCached(this, name, 'data');
    },
    module: function (name) {
        return locate.contextRender(this, name, 'module');
    },
    page: function (name) {
        return locate.contextRender(this, name, 'page');
    },
    react: function (name) {
        return locate.reactRender(this, name);
    },
    task: subtask
};

module.exports = webtaskContext;
