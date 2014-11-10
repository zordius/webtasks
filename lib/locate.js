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
        R = null;

    dirs.every(function (D) {
        var fname = D + name + (ext || '.js');
        if (fs.existsSync(fname)) {
            R = require(fname);
            return false;
        }
        return true;
    });

    if (R) {
        return R;
    }

    console.error('Can not find ' + base + ' task: "' + name + '" in directories: ' + dirs.join(','));
},

reactBind = function (reacts) {
    var O = [],
        R = [],
        I;

    reacts.forEach(function (react, I) {
        R.push(react.jsx + '=require("./react/' + react.jsx + '.jsx")');
        O.push('React.renderComponent(' + react.jsx + '.apply(' + react.jsx + ',' + JSON.stringify(react.props) + '), document.getElementById("' + I + '"))');
    });

    return O.length ? ('var React=require("react"),' + R.join(',') + ';' + O.join(';')) : null;
};

locate.all = function (app, base) {
    var dirs = getdirs(app, base, true),
        F = [];
    dirs.forEach(function (D) {
        F = F.concat(locate.files(D));
    });
    return F;
};

locate.files = function (dir) {
    var F = [];

    fs.readdirSync(dir).forEach(function (f) {
        F.push(dir + f);
    });

    return F;
};

locate.appRender = function (app, name, type) {
    var task = locate(app, name, type);

    if (!task) {
        return;
    }

    return function () {
        var CX = this;
        return task.apply(CX, arguments).transform(function (R) {
            var O = {
                view: type + '_' + name,
                data: R
            };

            if (type === 'page') {
                O.data.dreact = reactBind(CX.taskPool.react);
            }

            return O;
        }).pipe(render);
    };
};

locate.contextRender = function (CX, name, type) {
    return function () {
        var task = locate.contextCached(CX, name, type);

        return (task && task.apply) ? task.apply(CX, arguments).transform(function (R) {
            return {
                view: type + '_' + name,
                data: R
            };
        }).pipe(render) : subtask();
    };
};

locate.reactRender = function (req, name) {
    return function () {
        var component = locate(req, name, 'react', '.jsx');

        return subtask(
            component ? React.renderComponentToStaticMarkup(component.apply(component, arguments)) : undefined
        );
    };
};

locate.reactRenderDynamic = function (req, name) {
    return function () {
        var component = locate(req, name, 'react', '.jsx'),
            id = 'react_' + (++req.taskPool.react_id),
            props = [],
            I;

        for (I=0;I<arguments.length;I++) {
            props.push(arguments[I]);
        }

        req.taskPool.react[id] = {
            jsx: name,
            props: props
        };

        return (component && component.apply) ? subtask('<div class="reactContainer" id="' + id + '">' + React.renderComponentToString(component.apply(component, props)) + '</div>') : subtask();
    };
};

locate.contextTask = function (req, name, base) {
    var gottask = locate(req, name, base);

    return (gottask && gottask.apply) ? gottask.apply(req, []) : subtask();
};

locate.contextCached = function (req, name, base) {
    var gottask = locate(req, name, base),
        taskKey = base + '_' + name,
        Task;

    return (gottask && gottask.apply) ? function () {
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
    } : subtask();
};

module.exports = locate;
