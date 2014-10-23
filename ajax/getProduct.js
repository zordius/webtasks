/*jslint node: true */
'use strict';

module.exports = function () {
    return this.query('id').pipe(this.data('getProduct')).transform(function (R) {
        // sample to error handling...do not show this module
        if (!R.title) {
            return;
        }

        // Do some presentation jobs here....
        R.title += '...';

        return R;
    });
};
