/** @jsx React.DOM */
var React = require('react'),

Path = React.createClass({
    render: function () {
        var paths = this.props.path.map(function (P) {
            return (
                <li><a href={'/cate/' + P.id}>{P.title}</a></li>
            );
        });
        return (
            <ul className="path">
             {paths}
            </ul>
        );
    }
});

module.exports = Path;
