/** @jsx React.DOM */
var React = require('react'),
    LimitSelect = require('./limitSelect.jsx'),

Product = React.createClass({
    getInitialState: function () {
        return {selectedSpec: 0}
    },
    render: function () {
        var specs = [],
            I;

        for (I=0;I<this.props.specs.length;I++) {
            specs.push(
                <option id={this.props.specs[I].id}>{this.props.specs[I].title}</option>
            );
        }

        return (
<div>
 <h1>{this.props.title}</h1>
 <p>{this.props.description}</p>
 <span>Price: <i>$</i><b>{this.props.price}</b></span>
 <div>Pick a spec:<select>{specs}</select>
  <LimitSelect max={this.props.specs[this.state.selectedSpec].limit} />
 </div>
</div>
        );
    }
});

module.exports = Product;
