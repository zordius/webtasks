'use strict';

var assert = require('chai').assert,
    webtask = require('../webtasks.js'),
    subtask = require('subtask'),
    express = require('express');

describe('webtask module', function () {
    it('should be an express app', function (done) {
        assert.equal('function', typeof webtask.get);
        assert.equal('function', typeof webtask.set);
        assert.equal('function', typeof webtask.use);
        assert.equal('function', typeof webtask.get);
        assert.equal('function', typeof webtask.post);
        done();
    });
});

describe('webtask.middleware()', function () {
    it('should get a page middleware', function (done) {
        var sample = webtask.middleware('page', 'sample');
        assert.equal('function', typeof sample);
        done();
    });
});
