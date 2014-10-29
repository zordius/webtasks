/*jslint node: true */
'use strict';

var subtask = require('subtask'),
    path = require('path'),
    render = require('./render'),
    fs = require('fs'),
    React = require('react'),

getdirs = function (app, base, relative) {
    var appdir = (app && app.get) ? app.get(base + '_dir') : null,
        dir = appdir || ((relative ? ('./' + base) : path.resolve(process.cwd() , base)) + '/');

    return (dir.pop ? dir : [dir]);
},

locate = function (app, name, base, ext) {
    var dirs = getdirs(app, base),
        fname;

    for (var I in dirs) {
        fname = dirs[I] + name + (ext || '.js');
        if (fs.existsSync(fname)) {
            return require(fname);
        }
    }

    console.error('Can not find ' + base + ' task: "' + name + '" in directories: ' + dirs.join(','));
};

locate.all = function (app, base) {
    var dirs = getdirs(app, base, true),
        F = [];
    for (var I in dirs) {
        fs.readdirSync(dirs[I]).forEach(function (f) {
            F.push(dirs[I] + f);
        });
    }
    return F;
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
    };
};

locate.reactRender = function (req, name) {
    return function () {
        var component = locate(req, name, 'react', '.jsx'),
            id = 'react_' + (++req.taskPool.react_id);
        return subtask('<div class="reactContainer" id="' + id + '">' +
            React.renderComponentToString(component.apply(component, arguments))
            + '</div>'
        );
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
