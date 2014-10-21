/*jslint node: true */
'use strict';

module.exports = function () {
    return this.dtask({
        title: this.query('id').pipe(this.data('getProduct')).pick('title'),
        headerGroup: ['fake header'],
        product: this.query('id').pipe(this.module('product'))
    }).transform(function (R) {
        R.bodyGroup = [R.product];
        return {
            layout: 'page_default',
            data: R
        };
    });
};
