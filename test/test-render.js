'use strict';

var assert = require('chai').assert,
    render = require('../lib/render'),
    testlib = require('../lib/test');

describe('render', function () {
    it('should be a task creator', function (done) {
        assert.equal(true, testlib.isSubtaskCreator(render));
        done();
    });

    it('should create a task even when no input', function (done) {
        assert.equal(true, testlib.isSubtask(render()));
        done();
    });

    it('should create a task even when view not found', function (done) {
        assert.equal(true, testlib.isSubtask(render({})));
        done();
    });

    it('should render by a view', function (done) {
        render({view: 'module_nothing'}).execute(function (R) {
            assert.equal('<div>OK!</div>\n', R);
            done();
        });
    });
});

