/** @jsx React.DOM */
var React = require('react'),

LimitSelect = React.createClass({
    render: function () {
        var options = [],
            I;

        for (I=0;I<this.props.max;I++) {
            options.push(
                <option>{I+1}</option>
            );
        };
        return (
            <select>
             {options}
            </select>
        );
    }
});

module.exports = LimitSelect;
