/*jslint node: true */
'use strict';

var apicalls = 0;

module.exports = function () {
    return this.fetch({
        url: 'https://query.yahooapis.com/v1/public/yql?q=show%20tables&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
        json: true
    }).transform(function (R) {
        return R.body.query.results;
    });
};
