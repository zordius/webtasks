/*jslint node: true */
'use strict';

var task = require('subtask');

module.exports = function (CX) {
    return task({
        title: CX.query('id').pipe(CX.data('getProduct')).pick('title'),
        headerGroup: ['fake header'],
        bodyGroup: ['This is a test~~']
    }).transform(function (R) {
        return {
            layout: 'page_default',
            data: R
        };
    });
};
