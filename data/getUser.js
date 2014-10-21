/*jslint node: true */
'use strict';

module.exports = function () {
    var name = 'user_' + this.req.cookies.username;
    console.log('user name: ' + name);
    return this.task(name);
};
