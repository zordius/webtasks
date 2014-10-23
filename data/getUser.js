/*jslint node: true */
'use strict';

module.exports = function () {
    return this.cookie('username').transform(function (R) {
        console.log('user name: user_' + R);
        return 'user_' + R;
    });
};
