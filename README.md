webtasks
========

A lightweight web framework based on <a href="https://github.com/strongloop/express">express</a> and <a href="https://github.com/zordius/subtask.js">subtask.js</a>

Features
--------

Make developer decouple complex web application logic into small logic pieces to help them reuse them, and speed up implement and testing.

* All logical components are webtasks in commonjs.
* All webtask are async.

**Logical components in this framework**

* **Input**: focus on deal with params or other request based inputs
* **Data**: call api or get data from storage
* **Module**: handle presentation logics then rendered with a view
* **Page**: composite modules then rendered with a view

Getting Started
---------------

**Create your app**

```
npm init
npm install webtasks --save
```

** Hello World**

* Create a page webtask in `./page/hello.js`:

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

* Create a handlebars.js view for hello.js in `.view/page_hello.hbs` :

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

* Create a express.js server in `./server.js` :

```javascript
/*jslint node: true */
'use strict';

var app = require('webtasks');

app
.webtask(app.page('hello'))
.listen(3000);
```
