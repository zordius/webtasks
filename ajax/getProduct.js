/*jslint node: true */
'use strict';

module.exports = function () {
    return this.query('id').pipe(this.data('getProduct')).transform(function (R) {
        // sample to error handling...
        if (!R.title) {
            return;
        }

        // Do some extra jobs here....
        R.title += '...';

        return R;
    });
};
