/** @jsx React.DOM */
var React = require('react'),
    LimitSelect = require('./limitSelect.jsx'),

Product = React.createClass({
    render: function () {
        return (
<div>
 <h1>{this.props.title}</h1>
 <p>{this.props.description}</p>
 <span>Price: <i>$</i><b>{this.props.price}</b></span>
 <LimitSelect max={this.props.limit} />
</div>
        );
    }
});

module.exports = Product;
