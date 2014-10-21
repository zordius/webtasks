/*jslint node: true */
'use strict';

module.exports = function () {
    return this.task({
        title: this.query('id').pipe(this.data('getProduct')).pick('title'),
        headerGroup: ['fake header'],
        product: this.query('id').pipe(this.module('product')).pipe(this.render)
    }).transform(function (R) {
        R.bodyGroup = [R.product];
        return {
            layout: 'page_default',
            data: R
        };
    });
};
