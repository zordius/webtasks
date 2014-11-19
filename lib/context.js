/*jslint node: true */
'use strict';

var request_id = 0,
    subtask = require('subtask'),
    locate = require('./locate'),
    render = require('./render'),
    React = require('react'),

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
        return subtask.before(locate.subtask(this, name, 'data'), contextCached, this);
    },
    module: function (name) {
        return subtask.after(locate.subtask(this, name, 'module'), function (T) {
            return T.transform(function (R) {
                return {view: 'module_' + name, data: R};
            }).pipe(render);
        }, this);
    },
    page: function (name) {
        return subtask.after(locate.subtask(this, name, 'page'), function (T) {
            return T.transform(function (R) {
                return {view: 'page_' + name, data: R};
            }).pipe(render);
        }, this);
    },
    react: function (name) {
        var CX = this;
        return function () {
            var component = locate(CX, name, 'react', '.jsx'),
                task;

            if (component) {
                try {
                    task = subtask(React.renderComponentToStaticMarkup(component.apply(component, arguments)));
                } catch (E) {
                    CX.taskPool.errors.push(E);
                }
            }

            return task || subtask();
        };
    },
    dreact: function (name) {
        var CX = this;

        return function () {
            var component = locate(CX, name, 'react', '.jsx'),
                id = 'react_' + (++CX.taskPool.react_id);

            CX.taskPool.react[id] = {
                jsx: name,
                props: Array.prototype.slice.call(arguments)
            };

            return (component && component.apply) ? subtask('<div class="reactContainer" id="' + id + '">' + React.renderComponentToString(component.apply(component, arguments)) + '</div>') : subtask();
        };
    },
    reactBindStr: function () {
        var O = [],
            R = [],
            react,
            reacts = this.taskPool.react,
            I;

        for (I in reacts) {
            if (reacts.hasOwnProperty(I)) {
                react = reacts[I];
                R.push(react.jsx + '=require("./react/' + react.jsx + '.jsx")');
                O.push('React.renderComponent(' + react.jsx + '.apply(' + react.jsx + ',' + JSON.stringify(react.props) + '), document.getElementById("' + I + '"))');
            }
        }

        return O.length ? ('var React=require("react"),' + R.join(',') + ';' + O.join(';')) : null;
    },
    task: function () {
        var T = subtask.apply(this, arguments).quiet();
        T.errors = this.taskPool.errors;
        return T;
    }
};

webtaskContext.prototype = webtaskContextProto;

module.exports = webtaskContext;
