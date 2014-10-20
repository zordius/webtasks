/*jslint node: true */
'use strict';

var task = require('subtask'),
    exphbs = require('express-handlebars'),
    path = require('path'),
    fs = require('fs'),

init = function (app) {
    app.engine('.hbs', exphbs({defaultLayout: false, extname: '.hbs'}));
    app.set('view engine', '.hbs');
    app.webtask = webtask;
    app.page = page;
    app.module = amodule;
    app.data = data;
},

locate = function (app, name, base) {
    var dir = app.get(base + '_dir') || path.resolve(process.cwd() , base) + '/',
        dirs = dir.pop ? dir : [dir],
        name;

    for (var I in dirs) {
        name = dirs[I] + name + '.js';
        if (fs.existsSync(name)) {
            return require(name);
        }
    }
},

page = function (name) {
    return locate(this, name, 'pages');
},

amodule = function (name) {
    return locate(this, name, 'modules');
},

data = function (name) {
    return locate(this, name, 'data');
},

webtask = function (task) {
    this.use(function (req, res, next) {
        task({
            req: req,
            res: res,
            page: page,
            module: amodule,
            data: data
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
