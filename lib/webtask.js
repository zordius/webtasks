/*jslint node: true */
'use strict';

var task = require('subtask'),
    exphbs = require('express-handlebars'),
    path = require('path'),
    fs = require('fs'),
    request_id = 0,

init = function (app) {
    app.engine('.hbs', exphbs({defaultLayout: false, extname: '.hbs'}));
    app.set('view engine', '.hbs');
    app.webtask = webtask;
    app.page = function (name) {
        return locate(app, name, 'pages');
    };
    app.module = function (name) {
        return locate(app, name, 'modules');
    };
    app.data = function (name) {
        return locate(app, name, 'data');
    };
},

locate = function (app, name, base) {
    var appdir = (app && app.get) ? app.get(base + '_dir') : null,
        dir = appdir || path.resolve(process.cwd() , base) + '/',
        dirs = dir.pop ? dir : [dir],
        fname;

    for (var I in dirs) {
        fname = dirs[I] + name + '.js';
        if (fs.existsSync(fname)) {
            return require(fname);
        }
    }

    throw 'Can not find ' + base + ' task: "' + name + '" in directories: ' + dirs.join(',');
},

requestlocate = function (app, name, base) {
    var gottask = locate(app, name, base);

    if (app) {
        gottask.taskKey = base + '_' + name;
        gottask.pool = app.taskPool;
    }

    return gottask;
},

page = function (name) {
console.log('cx page!');
    return requestlocate(this, name, 'pages');
},

amodule = function (name) {
    return requestlocate(this, name, 'modules');
},

data = function (name) {
    return requestlocate(this, name, 'data');
},

param = function (name) {
    return task(this.req.params[name]);
},

query = function (name) {
    return task(this.req.query[name]);
},

context = function (req, res) {
},

webtask = function (task) {
    this.use(function (req, res, next) {
        task({
            req: req,
            res: res,
            page: page,
            module: amodule,
            param: param,
            data: data,
            query: query,
            dtask: task,
            taskPool: {},
            request_id: request_id++
        }).execute(function (R) {
            if (R && R.data) {
                if (R.layout) {
                    res.render(R.layout, R.data);
                } else {
                    res.json(R.data);
                }
            } else {
                next();
            }
        });
    });
};

webtask.init = init;

module.exports = webtask;
