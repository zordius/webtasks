/*jslint node: true */
'use strict';

var request_id = 0,
    subtask = require('subtask'),
    locate = require('./locate'),
    render = require('./render'),

contextCached = function (task, args) {
    var taskKey = task.taskType + '_' + task.taskName + ':' + Array.prototype.slice.call(args).join(','),
        Task = this.taskPool[taskKey];

    if (!Task) {
        if (task && task.apply) {
            Task = task.apply(this, args);
            Task.taskType = task.taskType;
            Task.taskName = task.taskName;
            this.taskPool[taskKey] = Task;
        }
    }

    return Task;
},

contextRender = function (task) {
    return task.transform(function (R) {
        return {
            view: this.taskType + '_' + this.taskName,
            data: R
        }
    }).pipe(render);
},

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
        return locate.subtask(this, name, 'input').apply(this, []);
    },
    data: function (name) {
        return subtask.before(locate.subtask(this, name, 'data'), contextCached);
    },
    module: function (name) {
        return subtask.after(locate.subtask(this, name, 'module'), contextRender);
    },
    page: function (name) {
        return subtask.after(locate.subtask(this, name, 'page'), contextRender);
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
