/*jslint node: true */
'use strict';

var subtask = require('subtask'),
    path = require('path'),
    fs = require('fs'),

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

locate.all = function (app, base, match) {
    var dirs = getdirs(app, base, true),
        F = [];
    dirs.forEach(function (D) {
        F = F.concat(locate.files(D, match));
    });
    return F;
};

locate.files = function (dir, match) {
    var F = [];

    fs.readdirSync(dir).forEach(function (f) {
        if (match && !f.match(match)) {
            return;
        }
        F.push(dir + f);
    });

    return F;
};

locate.bundle = function () {
    var ret = ['var React = require(\'react\'),', ' REACTS = {'];

    locate.all(null, 'react', /jsx$/).forEach(function (O) {
        ret.push(' \'' + O + '\': require(\'' + O + '\'),');
    });
    ret.push('},');
    ret.push('render = function (N, D, M) {React.render(React.createFactory(REACTS[N])(D), M);\nreturn render};');
    ret.push('module.exports = render;');
    return ret.join('\n');
};

module.exports = locate;
