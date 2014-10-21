/*jslint node: true */
'use strict';

module.exports = function () {
    return this.task({
        title: this.query('id').pipe(this.data('getProduct')).pick('title'),
        headerModule: this.data('getUser')(), //.pipe(this.module('header')).pipe(this.render),
        productModule: this.query('id').pipe(this.module('product')).pipe(this.render)
    }).transform(function (R) {
        console.log(R);
        return {
            layout: 'page_default',
            data: {
                title: R.title,
                headerGroup: [R.headerModule],
                bodyGroup: [R.productModule]
            }
        };
    });
};
