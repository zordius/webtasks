/*jslint node: true */
'use strict';

module.exports = function (user_id) {
    return this.task({
        user_id: user_id
    });
};
