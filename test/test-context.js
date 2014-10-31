'use strict';

var assert = require('chai').assert,
    testlib = require('../lib/test'),
    context = require('../lib/context.js');

describe('context', function () {
    it('.query should be a subtask', function (done) {
        assert.equal(true, testlib.isSubtask(testlib.getMockContext().query));
        done();
    });
    it('.param should be a subtask', function (done) {
        assert.equal(true, testlib.isSubtask(testlib.getMockContext().param));
        done();
    });
    it('.cookie should be a subtask', function (done) {
        assert.equal(true, testlib.isSubtask(testlib.getMockContext().cookie));
        done();
    });
});
