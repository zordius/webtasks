/*jslint node: true */
'use strict';

var subtask = require('subtask'),
    exphbs = require('express-handlebars'),
    cookieparser = require('cookie-parser'),
    hbsObj = null,
    path = require('path'),
    fs = require('fs'),
    request_id = 0,

init = function (app) {
    hbsObj = exphbs.create({defaultLayout: false, extname: '.hbs'});
    app.engine('.hbs', hbsObj.engine);
    app.set('view engine', '.hbs');
    app.webtask = webtask;
    app.use(cookieparser());

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
    var gottask = locate(app, name, base),
        taskKey,
        Task;

    if (!app) {
        return gottask;
    }

    taskKey = base + '_' + name;
console.log('before get task:' + taskKey);

    return function () {
        var I;
        for (I=0;I<arguments.length;I++) {
            taskKey = taskKey + '_' + arguments[I];
        }
console.log('task:' + taskKey);
        if (app.taskPool[taskKey]) {
            return app.taskPool[taskKey];
        }
        Task = gottask.apply(app, arguments);
        app.taskPool[taskKey] = Task;
        return Task;
    };
},

page = function (name) {
    return locate(this, name, 'pages');
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
            hbsObj.render('views/' + R.layout + '.hbs', R.data).then(function (V) {
                cb(V);
            }, function (E) {
                cb();
                throw E;
            });
        });
    } else {
        throw {error: 'Can not render without layout or data'};
    };
},

webtask = function (task) {
    this.use(function (req, res, next) {
        task.apply({
            req: req,
            res: res,
            query: query,
            param: param,
            task: subtask,
            page: page,
            module: amodule,
            data: data,
            render: render,
            request_id: ++request_id,
            taskPool: {}
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
