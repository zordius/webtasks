/** @jsx React.DOM */
var React = require('react'),

Path = React.createClass({
    render: function () {
        return (
            <ul className="path">
             <li>Category 1</li>
             <li>Category 2</li>
             <li>Category 3</li>
            </ul>
        );
    }
});

module.exports = Path;
