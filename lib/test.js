/*jslint node: true */
'use strict';

var locate = require('./locate'),
    context = require('./context'),
    subtask = require('subtask'),
    sandbox = {},
    I,

subtaskMaker = function () {
    return subtask();
},

getSandbox = function () {
    var O = function () {};

    O.prototype = sandbox;
    return new O();
},

TestLib = {
    isSubtask: function (task) {
        return subtask.isSubtask(task.apply(TestLib.getMockContext()));
    },
    getMockContext: function (req, res) {
        var mock = require('express-mocks-http');

        return new context(mock.createRequest(req), mock.createResponse(res));
    }
};

for (I in context.prototype) {
    sandbox[I] = subtaskMaker;
}

module.exports = TestLib;
