'use strict';

var assert = require('chai').assert,
    subtask = require('subtask'),
    context = require('../lib/context.js'),
    locate = require('../lib/locate.js');                                                                                     
describe('locate', function () {
    it('should return undefined when directory not found', function (done) {
        assert.equal(undefined, locate(null, 'not found', 'what'));
        done();
    });

    it('should return undefined when file not found', function (done) {
        assert.equal(undefined, locate(null, 'not found', '.'));
        done();
    });

    it('should return a page task', function (done) {
        var page = locate(null, 'sample', 'page');

        assert.equal('function', typeof page);
        assert.equal(true, context.isSubtask(page));
        done();
    });

    it('should return a ajax tqsk', function (done) {
        var ajax = locate(null, 'getProduct', 'ajax');

        assert.equal('function', typeof ajax);
        assert.equal(true, context.isSubtask(ajax));
        done();
    });
});

