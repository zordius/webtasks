'use strict';

var assert = require('chai').assert,
    context = require('../lib/context.js');

describe('context.prototype', function () {
    it('.query should be a subtask', function (done) {
        assert.equal(true, context.isSubtask(context.prototype.query()));
        done();
    });
});
