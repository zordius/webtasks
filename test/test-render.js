'use strict';

var assert = require('chai').assert,
    render = require('../lib/render'),
    testlib = require('../lib/test');

describe('render', function () {
    it('should be a task creator', function (done) {
        assert.equal(true, testlib.isSubtaskCreator(render));
        done();
    });
});

