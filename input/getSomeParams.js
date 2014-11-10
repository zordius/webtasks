/*jslint node: true */
'use strict';

module.exports = function () {
    return this.task({
        username: this.cookie('username')
    });
};
