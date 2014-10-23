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
        fname,
        MOD;

    for (var I in dirs) {
        fname = dirs[I] + name + '.js';
        if (fs.existsSync(fname)) {
            MOD = require(fname);
            MOD._webtaskType = base;
            MOD._webtaskName = name;
            return MOD;
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

    return function () {
        var I;
        for (I=0;I<arguments.length;I++) {
            taskKey = taskKey + '_' + arguments[I];
        }
        if (app.taskPool[taskKey]) {
            return app.taskPool[taskKey];
        }
        Task = gottask.apply(app, arguments);
        app.taskPool[taskKey] = Task;
        return Task;
    };
},

page = function (name) {
    return locate(this, name, 'pages')().transform(function (R) {
console.log('transform!?');
        return {
            layout: 'page_' + name,
            data: R
        };
    }).pipe(render);
},

amodule = function (name) {
    var app = this;
    return function () {
        return requestlocate(app, name, 'modules').apply(app, arguments).transform(function (R) {
            return {
                layout: 'module_' + name,
                data: R
            };
        }).pipe(app.render);
    }
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
    // Skip rendering
    if (!R) {
        return subtask();
    }

    if (!R.layout) {
        throw {error: 'internal error...render() without .layout'};
    }

    if (R.data === undefined) {
        console.warn('rendering view:' + R.layout + ' with undefined');
    }

    return subtask(function (cb) {
        hbsObj.render('views/' + R.layout + '.hbs', R.data).then(function (V) {
            cb(V);
        }, function (E) {
            cb();
            console.log(E);
        });
    });
},

webtask = function (task) {
    this.use(function (req, res, next) {
        task.apply({
            req: req,
            res: res,
            query: query,
            param: param,
            task: subtask,
            module: amodule,
            data: data,
            render: render,
            request_id: ++request_id,
            taskPool: {}
        }).transform(function (R) {
            return {
                layout: task._webtaskType + '_' + task._webtaskName,
                data: R
            };
        }).pipe(render).execute(function (R) {
            if (R) {
                res.send(R);
            } else {
                next();
            }
        });
    });
};

webtask.init = init;

module.exports = webtask;
