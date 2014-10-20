/*jslint node: true */
'use strict';

var task = require('subtask');

module.exports = function (CX) {
    return task(function (cb) {
        task({
            title: CX.param('id').pipe(CX.data('getProduct')).pick('title'),
            headerGroup: ['fake header'],
            bodyGroup: ['This is a test~~']
        }).execute(function (R) {
            cb({
                layout: 'page_default',
                data: R
            });
        });
    });
};
