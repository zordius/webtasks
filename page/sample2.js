/*jslint node: true */
'use strict';

module.exports = function () {
    return this.task({
        title: this.query('id').pipe(this.data('getProduct')).pick('title'),
        headerModule: this.data('getUser')().pipe(this.module('header')),
        productModule: this.query('id').pipe(this.module('product'))
    }).transform(function (R) {
        return {
            title: R.title,
            headerGroup: [R.headerModule],
            bodyGroup: [R.productModule]
        };
    });
};
