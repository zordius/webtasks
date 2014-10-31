'use strict';

var assert = require('chai').assert,
    webtask = require('../webtasks.js');

describe('webtask', function () {
    it('should be an express app', function (done) {
        assert.equal('function', typeof webtask.get);
        assert.equal('function', typeof webtask.set);
        assert.equal('function', typeof webtask.use);
        assert.equal('function', typeof webtask.get);
        assert.equal('function', typeof webtask.post);
        done();
    });

    it('should have middleware() method', function (done) {
        assert.equal('function', typeof webtask.middleware);
        done();
    });
});

describe('webtask.middleware()', function () {
    it('should get a page middleware', function (done) {
        var sample = webtask.middleware('page', 'sample');
        assert.equal('function', typeof sample);
        done();
    });

    it('should return undefined when not found', function (done) {
        var sample = webtask.middleware('page', 'not found');
        assert.equal(undefined, sample);
        done();
    });
});