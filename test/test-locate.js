'use strict';

var assert = require('chai').assert,
    subtask = require('subtask'),
    testlib = require('../lib/test'),
    locate = require('../lib/locate');

describe('locate', function () {
    it('should return undefined when directory not found', function (done) {
        assert.equal(undefined, locate(null, 'not found', 'what'));
        done();
    });

    it('should return undefined when file not found', function (done) {
        assert.equal(undefined, locate(null, 'not found', '.'));
        done();
    });

    it('should return a page task creator', function (done) {
        var page = locate(null, 'sample', 'page');

        assert.equal('function', typeof page);
        assert.equal(true, testlib.isSubtaskCreator(page));
        done();
    });

    it('should return a ajax task creator', function (done) {
        var ajax = locate(null, 'getProduct', 'ajax');

        assert.equal('function', typeof ajax);
        assert.equal(true, testlib.isSubtaskCreator(ajax));
        done();
    });
});

describe('locate.contextCached', function () {
    it('should return a fresh task when 1st run', function (done) {
        var context1 = testlib.getMockContext(),
            context2 = testlib.getMockContext(),
            module1 = locate.contextCached(context1, 'header', 'module'),
            module2 = locate.contextCached(context2, 'header', 'module');

        module1().execute(function (R) {
            this.exec = true;
            module2().execute(function (R) {
                assert.equal(undefined, this.exec);
                done();
            });
        });
    });

    it('should return different task when arguments different', function (done) {
        var context = testlib.getMockContext(),
            module1 = locate.contextCached(context, 'header', 'module'),
            module2 = locate.contextCached(context, 'header', 'module');

        module1(1).execute(function (R) {
            this.exec = true;
            module2(2).execute(function (R) {
                assert.equal(undefined, this.exec);
                done();
            });
        });
    });
});
