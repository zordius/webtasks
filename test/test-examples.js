'use strict';

var assert = require('chai').assert,
    testlib = require('../lib/test'),
    context = require('../lib/context.js');

describe('examples - for coverage', function () {
    it('module("product") error', function (done) {
        testlib.getMockContext().module('product')(123.4).execute(function (D) {
            assert.equal(true, D !== undefined);
            done();
        });
    });

    it('module("product") success', function (done) {
        testlib.getMockContext().module('product')(123).execute(function (D) {
            assert.equal(true, D !== undefined);
            done();
        });
    });
});
