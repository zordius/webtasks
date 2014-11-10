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

    it('.data should be a subtask creator', function (done) {
        assert.equal(true, testlib.isSubtaskCreator(testlib.getMockContext().data));
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
