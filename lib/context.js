/*jslint node: true */
'use strict';

var request_id = 0,
    locate = require('./locate'),
    subtask = require('subtask'),
    sandbox = {},
    I,

subtaskMaker = function () {
    return subtask();
},

getSandbox = function () {
    var O = function () {};

    O.prototype = sandbox;
    return new O();
},

webtaskContext = function (req, res) {
    this.request_id = ++request_id;
    this.taskPool = {
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
    task: subtask
};

webtaskContext.prototype = webtaskContextProto;

for (I in webtaskContextProto) {
    sandbox[I] = subtaskMaker;
}

webtaskContext.isSubtask = function (task) {
    return subtask.isSubtask(task.apply(getSandbox()));
};


module.exports = webtaskContext;
