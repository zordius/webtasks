'use strict';

var assert = require('chai').assert,
    mock = require('node-mocks-http'),
    sinon = require('sinon'),
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

    it('should get a module middleware', function (done) {
        var sample = webtask.middleware('module', 'product');
        assert.equal('function', typeof sample);
        done();
    });

    it('should get an ajax middleware', function (done) {
        var sample = webtask.middleware('ajax', 'getProduct');
        assert.equal('function', typeof sample);
        done();
    });

    it('should return undefined when not found', function (done) {
        var sample = webtask.middleware('page', 'not found');
        assert.equal(undefined, sample);
        done();
    });

    it('should send result when task done', function (done) {
        var nothingModule = webtask.middleware('module', 'nothing'),
            noNext = true,
            res = mock.createResponse();

        sinon.stub(res, 'send', function (D) {
            assert.equal(true, noNext);
            assert.equal('<div>OK!</div>\n', D);
            res.send.restore();
            done();
        });

        nothingModule(mock.createRequest(), res, function () {
            noNext = false;
        });
    });

    it('should call next when task return undefined', function (done) {
        var errorModule = webtask.middleware('module', 'noview'),
            res = mock.createResponse();

        sinon.stub(res, 'send', function (D) {
            res.send.restore();
            assert.equal(false, 'res.send() should never be called');
        });

        errorModule(mock.createRequest(), res, function () {
            // good to be here...
            done();
        });
    });

    it('should handle task errors', function (done) {
        var errorModule = webtask.middleware('module', 'product'),
            noNext = true,
            consoleError = 0,
            res = mock.createResponse();

        sinon.stub(console, 'error', function (E) {
            consoleError++;
        });

        sinon.stub(res, 'send', function (D) {
            assert.equal(true, noNext);
            assert.equal(1, consoleError);
            res.send.restore();
            console.error.restore();
            done();
        });

        errorModule(mock.createRequest(), res, function () {
            noNext = false;
        });
    });

    it('should handle react binding when type is page', function (done) {
        var page = webtask.middleware('page', 'sample3'),
            noNext = true,
            res = mock.createResponse();

        sinon.stub(res, 'send', function (D) {
            assert.equal(true, D !== undefined);
            assert.equal(true, D.match(/var React/) !== undefined);
            assert.equal(true, noNext);
            res.send.restore();
            done();
        });

        page(mock.createRequest({
            query: {id: '123'},
        }), res, function () {
            noNext = false;
            assert.equal(true, noNext);
            res.send.restore();
            done();
        });
    });
});

describe('webtask.middleware("ajax", "getProduct")', function () {
    it('should send response', function (done) {
        var page = webtask.middleware('ajax', 'getProduct'),
            noNext = true,
            res = mock.createResponse();

        sinon.stub(res, 'send', function (D) {
            assert.equal(true, D !== undefined);
            assert.equal(1, D.title.match(/\.\.\./).length);
            assert.equal(true, noNext);
            res.send.restore();
            done();
        });

        page(mock.createRequest({
            query: {id: '123'},
        }), res, function () {
            noNext = false;
            assert.equal(true, noNext);
            res.send.restore();
            done();
        });
    });

    it('should call next', function (done) {
        var page = webtask.middleware('ajax', 'getProduct'),
            noSend = true,
            res = mock.createResponse();

        sinon.stub(res, 'send', function (D) {
            noSend = false;
            res.send.restore();
            done();
        });

        page(mock.createRequest({
            query: {id: '123.4'},
        }), res, function () {
            assert.equal(true, noSend);
            res.send.restore();
            done();
        });
    });
});
