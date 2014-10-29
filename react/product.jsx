/** @jsx React.DOM */
var React = require('react'),

Product = React.createClass({
    render: function () {
        return (
<div>
 <h1>{this.props.title}</h1>
 <p>{this.props.description}</p>
 <span>Price: <i>$</i><b>{this.props.price}</b></span>
</div>
        );
    }
});

module.exports = Product;
