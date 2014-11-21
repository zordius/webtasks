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

    it('.reactBindStr() should return null when no react modules', function (done) {
        assert.equal(null, testlib.getMockContext().reactBindStr());
        done();
    });

    it('.reactBindStr() should return js code for client to bind react modules', function (done) {
        var CX = testlib.getMockContext();
        CX.taskPool.react = {Rid: {jsx: 'Test', props: [1, 2]}};
        assert.equal('var React=require("react"),Test=require("./react/Test.jsx");React.renderComponent(Test.apply(Test,[1,2]), document.getElementById("Rid"))', CX.reactBindStr());
        done();
    });
});

describe('context tasks', function () {
    it('data("getProduct")(id) should be a success task', function (done) {
        testlib.getMockContext().data('getProduct')(123).execute(function (D) {
            assert.equal(true, D !== undefined);
            assert.equal('this is sample product title (id=123)', D.title);
            done();
        });
    });
    it('module("header")() should be a success task', function (done) {
        testlib.getMockContext().module('header')().execute(function (D) {
            assert.equal(true, D !== undefined);
            done();
        });
    });

    it('page("sample")() should be a success task', function (done) {
        testlib.getMockContext().page('sample')().execute(function (D) {
            assert.equal(true, D !== undefined);
            done();
        });
    });

    it('react("Path")(productData) should be a success task', function (done) {
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

    it('react("Path")(badData) should be a failed task', function (done) {
        var CX = testlib.getMockContext(),
            T = CX.react('Path')({});

        T.execute(function (D) {
            assert.equal(undefined, D);
            assert.equal(1, CX.taskPool.errors.length);
            done();
        });
    });

    it('dreact("Bug")() should be a failed task', function (done) {
        var CX = testlib.getMockContext(),
            T = CX.dreact('Bug')();

        assert.equal(1, CX.taskPool.errors.length);
        assert.equal('MODULE_NOT_FOUND', CX.taskPool.errors[0].code);
        done();
    });
    it('creact("Bug")() should be a failed task', function (done) {
        var CX = testlib.getMockContext(),
            T = CX.creact('Bug')();

        assert.equal(1, CX.taskPool.errors.length);
        assert.equal('MODULE_NOT_FOUND', CX.taskPool.errors[0].code);
        done();
    });

    it('input("getABC")() should be a suceess task', function (done) {
        testlib.getMockContext({
            query: {
                q: 'abc',
                o: 12
            }
        }).input('getABC').execute(function (R) {
            assert.deepEqual({
                query: 'abc',
                offset: 12
            }, R);
            done();
        });
    });
});
