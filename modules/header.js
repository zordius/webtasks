/*jslint node: true */
'use strict';

module.exports = function (user_id) {
    return this.task({
        layout: 'header',
        data: user_id
    });
};
