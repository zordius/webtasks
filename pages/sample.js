/*jslint node: true */
'use strict';

var task = require('subtask');

module.exports = function (CX) {
    return task(function (cb) {
        cb({
            layout: 'page_default',
            data: {
                title: 'Sample page',
                bodyGroup: ['This is a test~~']
            }
        });
    });
};
