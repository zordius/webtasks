/*jslint node: true */
'use strict';

module.exports = function () {
console.log(this.req);
    var name = 'user_' + this.req.cookies.username;
    console.log(this.req.cookies);
    console.log('user name: ' + name);
    return this.task(name);
};
