/*jslint node: true */
'use strict';

var subtask = require('subtask'),
    path = require('path'),
    render = require('./render'),
    fs = require('fs'),

locate = function (app, name, base) {
    var appdir = (app && app.get) ? app.get(base + '_dir') : null,
        dir = appdir || path.resolve(process.cwd() , base) + '/',
        dirs = dir.pop ? dir : [dir],
        fname,
        MOD;

    for (var I in dirs) {
        fname = dirs[I] + name + '.js';
        if (fs.existsSync(fname)) {
            MOD = require(fname);
            return MOD;
        }
    }

    error('Can not find ' + base + ' task: "' + name + '" in directories: ' + dirs.join(','));
};

locate.appRender = function (app, type) {
    return function (name) {
        var gotTask = function () {
            return locate(app, name, type).apply(this, arguments).transform(function (R) {
                return {
                    view: type + '_' + name,
                    data: R
                };
            }).pipe(render);
        };

        gotTask._webtaskType = type;
        gotTask._webtaskName = name;

        return gotTask;
    };
};

locate.contextRender = function (req, name, type) {
    return function () {
        return locate.contextCached(req, name, type).apply(req, arguments).transform(function (R) {
            return {
                view: type + '_' + name,
                data: R
            };
        }).pipe(render);
    }
};

locate.contextCached = function (req, name, base) {
    var gottask = locate(req, name, base),
        taskKey = base + '_' + name,
        Task;

    return function () {
        var I;
        for (I=0;I<arguments.length;I++) {
            taskKey = taskKey + '_' + arguments[I];
        }
        if (req.taskPool[taskKey]) {
            return req.taskPool[taskKey];
        }
        Task = gottask.apply(req, arguments);
        req.taskPool[taskKey] = Task;
        return Task;
    };
},

module.exports = locate;
