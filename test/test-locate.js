'use strict';

var assert = require('chai').assert,
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
});

