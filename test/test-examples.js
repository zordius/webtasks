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

    it('data("getPath") input error', function (done) {
        testlib.getMockContext().data('getPath')().execute(function (D) {
            assert.equal(undefined, D);
            done();
        });
    });

    it('data("getPath") output error', function (done) {
        testlib.getMockContext().data('getPath')(123.4).execute(function (D) {
            assert.equal(undefined, D);
            done();
        });
    });

    it('data("getYQLTables") success', function (done) {
        testlib.getMockContext().data('getYQLTables')().execute(function (D) {
            assert.equal(true, D !== undefined);
            assert.equal(true, D.table.length > 1);
            done();
        });
    });
});
