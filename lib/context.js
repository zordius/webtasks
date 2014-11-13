/*jslint node: true */
'use strict';

var request_id = 0,
    locate = require('./locate'),
    subtask = require('subtask'),

webtaskContext = function (req, res) {
    this.request_id = ++request_id;
    this.taskPool = {
        errors: [],
        req: req,
        res: res,
        react_id: 0,
        react: {}
    };
},

webtaskContextProto = {
    cookie: function (name) {
        return subtask(this.taskPool.req.cookies[name]);
    },
    query: function (name) {
        return subtask(this.taskPool.req.query[name]);
    },
    param: function (name) {
        return subtask(this.taskPool.req.params[name]);
    },
    input: function (name) {
        return locate.contextTask(this, name, 'input');
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
    dreact: function (name) {
        return locate.reactRenderDynamic(this, name);
    },
    task: function () {
        var T = (arguments.length > 1 ? subtask.cache : subtask).apply(this, arguments).quiet();
        T.errors = this.taskPool.errors;
        return T;
    }
};

webtaskContext.prototype = webtaskContextProto;

module.exports = webtaskContext;
