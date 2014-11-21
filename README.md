webtasks
========

A lightweight web framework based on <a href="https://github.com/strongloop/express">express</a> and <a href="https://github.com/zordius/subtask.js">subtask.js</a>

[![npm version](https://img.shields.io/npm/v/webtasks.svg)](https://www.npmjs.org/package/webtasks) [![Dependency Status](https://david-dm.org/zordius/webtasks.png)](https://david-dm.org/zordius/webtasks) [![Build Status](https://travis-ci.org/zordius/webtasks.svg?branch=master)](https://travis-ci.org/zordius/webtasks) [![Test Coverage](https://codeclimate.com/github/zordius/webtasks/badges/coverage.svg)](https://codeclimate.com/github/zordius/webtasks) [![Code Climate](https://codeclimate.com/github/zordius/webtasks/badges/gpa.svg)](https://codeclimate.com/github/zordius/webtasks) [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE.txt)
Features
--------

Make developer decouple complex web application logic into small logic pieces for reusing, and speed up implement and testing.

* All logical components are webtasks in commonjs.
* All webtask are async.
* React support (and server side rendering)

**Logical components in this framework**

* **Input**: focus on deal with params or other request based inputs
* **Data**: call api or get data from storage
* **Module**: handle presentation logics then rendered with a view
* **Page**: composite modules then rendered with a view
* **React**: handle presentation logics then rendered with given properties (data)
* **Ajax**: collect data then output as JSON

Getting Started
---------------

**Create your app**

```
npm init
npm install webtasks --save
```

**Hello World**

* Create a page webtask in `page/hello.js`:

```javascript
/*jslint node: true */                                                                                  
'use strict';

module.exports = function () {
    return this.task({
        title: 'Good!',
        description: 'Hello World'
    });
};
```

* Create a <a href="http://handlebarsjs.com/">handlebars.js</a> view for `page/hello.js` in `view/page_hello.hbs` :

```
<html>
<head>
<title>{{title}}</title>
</head>
<body>
{{description}}
</body>
</html>
```

* Create an <a href="http://expressjs.com/">express</a> server in `server.js` :

```javascript
/*jslint node: true */
'use strict';

var app = require('webtasks');

app
.use(app.middleware('page', 'hello'))
.listen(3000);
```

* Start the server and browse http://localhost:3000/ :

```sh
node server.js
```

About Webtask
-------------

Webtask is extended from <a href="https://github.com/zordius/subtask.js">subtask</a> with <a href="#context-api">Context API</a> . Webtasks are automatic singleton per-request, developers do not need to worry about api optimization or task sequence.

For example, to deliver an article page for login user brings this task depdency:

```
[checkLogin] -> [getArticle] -> [setPageTitle] -> [composeModules]
```

If we add another module depend on another data source, then the module tasks will be appended after composeModules and make the task queue longer. When we try to speed up html deliver time, we will mess up the module composite tasks and data tasks.

When this done by webtasks it will like:

```javascript
// NOTE: pseudo code
articlePage = webtask({
    isLogin: input('isLogin'),
    title: param('id').pipe(data('getArticle')).pick('title'),   // one data('getArticle')
    story: param('id').pipe(module('article')),
});

articleModule = param('id').pipe(data('getArticle'));            // another data('getArticle')

dataGetArticle = function (id) {
    return webtask( ..... call API by id );
};
```

All `data('getArticle')` with same id in this request refer to single webtask instance, the API call will be executed only one time in a request. Another good news is all webtask/subtask are executed parallel, you get performance boost. And, all webtasks focus on handle jobs for itself, you do not need to add extra code to maintain states cross different modules.

Page Component
--------------

Page is a webtask which will be rendered by a handlebars.js temlpate view. All pages are placed under `page` directory, and all views for pages are placed under `view` directory with `page_*` prefix.

Module Component
----------------

Module is a webtask which will be rendered by a handlebars.js temlpate view. All modules are placed under `module` directory, and all views for pages are placed under `view` directory with `module_*` prefix. The behavior of a module or a page are exact same, they are named differently for concept reason.

Data Component
--------------

Data is a webtask without view and focus on get and processs data. All data are placed under `data` directory.

Input Component
---------------

Input is a webtask without view and focus on get and process inputs from request, all inputs are places under `input` directory. The behavior of a input or a data are exact same, they are named differently for concept reason.

AJAX Component
--------------

AJAX is a webtask without view and focus on response json by different request. Actually AJAX is normal webtask placed under `ajax` directory, and in most case it will execute input and data subtasks.


REACT Component
---------------

<a href="http://facebook.github.io/react/">REACT</a> is pure <a href="http://facebook.github.io/react/docs/jsx-in-depth.html">jsx</a> commonjs module be placed under `react` directory. You can pipe data into react component to render static or dynamic modules, please check the Context API: `this.react` and `this.dreact` .

Context API
-----------

All these API return a subtask

* `this.query(name)` : access to `req.query[name]`
* `this.param(name)` : access to `req.params[name]`
* `this.header(name)` : access to `req.header(name)`
* `this.cookie(name)` : access to `req.cookies[name]`
* `this.page(name)` : get a page subtask creator
* `this.module(name)` : get a module subtask creator
* `this.data(name)` : get a data subtask creator
* `this.input(name)` : get a input subtask
* `this.react` : get a react subtask creator (static)
* `this.dreact` : get a react subtask creator (will be rendered at server side then be binded at client side)
* `this.creact` : get a react subtask creator (will be rendered/binded at client side)

TODO
----

* sample project
* react state ajax bridge
* flux?
* css component
* gulp env
