/*jslint node: true */
'use strict';

module.exports = function () {
    return this.task({
        title: this.query('id').pipe(this.data('getProduct')).pick('title'),
        headerGroup: ['fake header'],
        bodyGroup: ['This is a test~~']
    }).transform(function (R) {
        return {
            layout: 'page_default',
            data: R
        };
    });
};
