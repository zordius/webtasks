/*jslint node: true */
'use strict';

module.exports = function (id) {
    return this.data('getProduct')(id)
    .transform(function (R) {
        return {
            layout: 'product',
            data: R
        }
    });
};
