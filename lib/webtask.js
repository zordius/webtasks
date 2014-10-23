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
    hbsObj = exphbs.create({
        defaultLayout: false,
        partialsDir: 'partial',
        extname: '.hbs'
    });
    app.set('views', 'view');
    app.engine('.hbs', hbsObj.engine);
    app.set('view engine', '.hbs');
    app.webtask = webtask;
    app.use(cookieparser());

    app.page = locateForAppWithRender(app, 'page');
    app.module = locateForAppWithRender(app, 'module');

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

    error('Can not find ' + base + ' task: "' + name + '" in directories: ' + dirs.join(','));
},

locateForAppWithRender = function (app, type) {
    return function (name) {
        return function () {
            return locate(app, name, type).apply(this, arguments).transform(function (R) {
                return {
                    view: type + '_' + name,
                    data: R
                };
            }).pipe(render);
        };
    };
},

locateForRequestWithRender = function (name, type) {
    var req = this;

    return function () {
        return locateForRequestWithCachePool(req, name, type).apply(req, arguments).transform(function (R) {
            return {
                view: type + '_' + name,
                data: R
            };
        }).pipe(render);
    }
},

locateForRequestWithCachePool = function (req, name, base) {
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

error = function (O) {
    console.error(O);
},

page = function (name) {
    return locateForRequestWithRender.apply(this, [name, 'page']);
},

amodule = function (name) {
    return locateForRequestWithRender.apply(this, [name, 'module']);
},

data = function (name) {
    return locateForRequestWithCachePool(this, name, 'data');
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

    // Should with view, show message and abort.
    if (!R.view) {
        error('internal error...render() without .view');
        return subtask();
    }

    // Should with data, show message.
    if (R.data === undefined) {
        error('rendering view: "' + R.view + '" with undefined');
    }

    return subtask(function (cb) {
        hbsObj.render('view/' + R.view + '.hbs', R.data).then(function (V) {
            cb(V);
        }, function (E) {
            cb();
            error(E);
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
        }).execute(function (R) {
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
