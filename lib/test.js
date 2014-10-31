/*jslint node: true */
'use strict';

var locate = require('./locate'),
    context = require('./context'),
    subtask = require('subtask'),

TestLib = {
    isSubtask: function (task, req, res) {
        return (task && task.apply) ? subtask.isSubtask(task.apply(TestLib.getMockContext(req, res))) : false;
    },
    isPipe: function (pipe, req, res) {
        var task = (pipe && pipe.apply) ? pipe.apply(TestLib.getMockContext(req, res)) : undefined;

        return task && TestLib.isSubtask(task);
    },
    getMockContext: function (req, res) {
        var mock = require('node-mocks-http');

        return new context(mock.createRequest(req), mock.createResponse(res));
    }
};

module.exports = TestLib;
