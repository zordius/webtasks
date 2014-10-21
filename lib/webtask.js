/*jslint node: true */
'use strict';

var subtask = require('subtask'),
    exphbs = require('express-handlebars'),
    hbsObj = null,
    path = require('path'),
    fs = require('fs'),
    request_id = 0,

init = function (app) {
    hbsObj = exphbs.create({defaultLayout: false, extname: '.hbs'});
    app.engine('.hbs', hbsObj.engine);
//app.engine('.hbs', exphbs({defaultLayout: false, extname: '.hbs'}));
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

    return function () {
        return gottask.apply(app, arguments);
    };
},

page = function (name) {
    return requestlocate(this, name, 'pages');
},

amodule = function (name) {
    return requestlocate(this, name, 'modules');
},

data = function (name) {
    return requestlocate(this, name, 'data');
},

param = function (name) {
    return subtask(this.req.params[name]);
},

query = function (name) {
    return subtask(this.req.query[name]);
},

render = function (R) {
    if (R && R.layout && R.data) {
        return subtask(function (cb) {
        });
    }
    return subtask();
},

webtask = function (task) {
    this.use(function (req, res, next) {
        task.apply({
            req: req,
            res: res,
            query: query,
            param: param,
            dtask: subtask,
            page: page,
            module: amodule,
            data: data,
            render: render,
            request_id: ++request_id
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
