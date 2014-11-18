/*jslint node: true */
'use strict';

var subtask = require('subtask'),
    path = require('path'),
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

    return R;
};

locate.subtask = function (app, name, base, ext) {
    var R = locate(app, name, base, ext);

    if (!R) {
        R = function () {
            return subtask().error('Can not find ' + base + ' task: "' + name);
        };
    }

    R.taskName = name;
    R.taskType = base;

    return R;
};

var reactBind = function (reacts) {
    var O = [],
        R = [],
        react,
        I;

    for (I in reacts) {
        if (reacts.hasOwnProperty(I)) {
            react = reacts[I];
            R.push(react.jsx + '=require("./react/' + react.jsx + '.jsx")');
            O.push('React.renderComponent(' + react.jsx + '.apply(' + react.jsx + ',' + JSON.stringify(react.props) + '), document.getElementById("' + I + '"))');
        }
    }

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

locate.reactRender = function (req, name) {
    return function () {
        var component = locate(req, name, 'react', '.jsx'),
            task;

        if (component) {
            try {
                task = subtask(React.renderComponentToStaticMarkup(component.apply(component, arguments)));
            } catch (E) {
                req.taskPool.errors.push(E);
            }
        }

        return task || subtask();
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

module.exports = locate;
