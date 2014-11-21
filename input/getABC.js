/*jslint node: true */
'use strict';

module.exports = function () {
    return this.task({
        query: this.query('q'),
        offset: this.query('o')
    });
};
