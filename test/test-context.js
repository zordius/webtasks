'use strict';

var assert = require('chai').assert,
    testlib = require('../lib/test'),
    context = require('../lib/context.js');

describe('context', function () {
    it('.query should be a subtask creator', function (done) {
        assert.equal(true, testlib.isSubtaskCreator(testlib.getMockContext().query));
        done();
    });

    it('.param should be a subtask creator', function (done) {
        assert.equal(true, testlib.isSubtaskCreator(testlib.getMockContext().param));
        done();
    });

    it('.cookie should be a subtask creator', function (done) {
        assert.equal(true, testlib.isSubtaskCreator(testlib.getMockContext().cookie));
        done();
    });

    it('.data should be a subtask creator locator', function (done) {
        assert.equal(true, testlib.isSubtaskCreatorFinder(testlib.getMockContext().data));
        done();
    });

    it('.data("getProdcut") should be a subtask creator', function (done) {
        assert.equal(true, testlib.isSubtaskCreator(testlib.getMockContext().data('getProduct')));
        done();
    });

    it('.module should be a subtask creator locator', function (done) {
        assert.equal(true, testlib.isSubtaskCreatorFinder(testlib.getMockContext().module));
        done();
    });

    it('.module("header") should be a subtask creator', function (done) {
        assert.equal(true, testlib.isSubtaskCreator(testlib.getMockContext().module('header')));
        done();
    });

    it('.module("not_found") should be a subtask creator', function (done) {
        assert.equal(true, testlib.isSubtaskCreator(testlib.getMockContext().module('not_found')));
        done();
    });

    it('.page should be a subtask creator locator', function (done) {
        assert.equal(true, testlib.isSubtaskCreatorFinder(testlib.getMockContext().page));
        done();
    });

    it('.react should be a subtask creator locator', function (done) {
        assert.equal(true, testlib.isSubtaskCreatorFinder(testlib.getMockContext().react));
        done();
    });

    it('.dreact should be a subtask creator locator', function (done) {
        assert.equal(true, testlib.isSubtaskCreatorFinder(testlib.getMockContext().dreact));
        done();
    });

    it('.task should be a subtask creator', function (done) {
        assert.equal(true, testlib.isSubtaskCreator(testlib.getMockContext().task));
        done();
    });

    it('.input should be a subtask creator', function (done) {
        assert.equal(true, testlib.isSubtaskCreator(testlib.getMockContext().input));
        done();
    });

    it('.input("getSomeParams") should be a subtask', function (done) {
        assert.equal(true, testlib.isSubtask(testlib.getMockContext().input('getSomeParams')));
        done();
    });
});

describe('context tasks', function () {
    it('module("header")() should be a success task', function (done) {
        testlib.getMockContext().module('header')().execute(function (D) {
            assert.equal(true, D !== undefined);
            done();
        });
    });

    it('react("path")(productData) should be a success task', function (done) {
        testlib.getMockContext().react('Path')({
            path: [
                {id: 1, title: 'root'},
                {id: 3, title: 'second'},
                {id: 321, title: 'final'}
            ]
        }).execute(function (D) {
            assert.equal('<ul class="path"><li><a href="/cate/1">root</a></li><li><a href="/cate/3">second</a></li><li><a href="/cate/321">final</a></li></ul>', D);
            done();
        });
    });
});
