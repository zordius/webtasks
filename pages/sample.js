/*jslint node: true */
'use strict';

var task = require('subtask');

module.exports = function (CX) {
    return task(function (cb) {
        cb({
            layout: 'index',
            data: {
                title: 'This is a test~~'
            }
        });
    });
};
