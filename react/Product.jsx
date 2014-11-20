/** @jsx React.DOM */
var React = require('react'),
    LimitSelect = require('./LimitSelect.jsx'),

Product = React.createClass({
    getInitialState: function () {
        return {selectedSpec: this.props.specs[0].id}
    },
    handleSpecChange: function () {
        this.setState({selectedSpec: event.target.value});
    },
    render: function () {
        var specs = [],
            max,
            I;

        for (I=0;I<this.props.specs.length;I++) {
            if (this.props.specs[I].id == this.state.selectedSpec) {
                max = this.props.specs[I].limit;
            }
            specs.push(
                <option value={this.props.specs[I].id}>{this.props.specs[I].title}</option>
            );
        }

        return (
<div>
 <h1>{this.props.title}</h1>
 <p>{this.props.description}</p>
 <span>Price: <i>$</i><b>{this.props.price}</b></span>
 <div>Pick a spec:<select onChange={this.handleSpecChange} value={this.state.selectedSpec}>{specs}</select>
  <LimitSelect max={max} />
 </div>
</div>
        );
    }
});

module.exports = Product;
