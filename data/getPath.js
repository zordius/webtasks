/*jslint node: true */
'use strict';

var apicalls = 0;

module.exports = function (category_id) {
    // example: input validation
console.log('category id: ' + category_id);
    if (!category_id) {
        return this.task();
    }

    return this.task(function (cb) {
        // example: async call to get product
        setTimeout(function() {
            // example: data validation after async tasks done
            if (Math.floor(category_id) !== category_id) {
                return cb();
            }

            console.log('category api called ' + (++apicalls));

            cb({
                title: 'category(' + category_id + ')',
                id: category_id,
                path: [
                    {title: 'l1', id: 123},
                    {title: 'l2', id: 456},
                    {title: 'l3', id: 789},
                    {title: 'l4', id: 'abc'}
                ]
            });
        }, 100);
    }, category_id);
};
