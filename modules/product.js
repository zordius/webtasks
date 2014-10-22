/*jslint node: true */
'use strict';

module.exports = function (id) {
    return this.data('getProduct')(id).transform(function (R) {
        // sample to error handling...do not show this module
        if (!R.title) {
            return;
        }

        // Do some presentation jobs here....
        R.title += '...';

        return R;
    });
};
