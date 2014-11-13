/*jslint node: true */
'use strict';

// This is a view only module without input or logic
// But, no view/module_noview.hbs , so this module will produce error later.
module.exports = function () {
    return this.task();
};
