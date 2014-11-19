require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./react/LimitSelect.jsx":[function(require,module,exports){
module.exports=require('W+i0zc');
},{}],"W+i0zc":[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react'),

LimitSelect = React.createClass({displayName: 'LimitSelect',
    render: function () {
        var options = [],
            I;

        for (I=0;I<this.props.max;I++) {
            options.push(
                React.createElement("option", null, I+1)
            );
        };
        return (
            React.createElement("select", null, 
             options
            )
        );
    }
});

module.exports = LimitSelect;

},{}],"tSjdzg":[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react'),

Path = React.createClass({displayName: 'Path',
    render: function () {
        var paths = this.props.path.map(function (P) {
            return (
                React.createElement("li", null, React.createElement("a", {href: '/cate/' + P.id}, P.title))
            )
        });
        return (
            React.createElement("ul", {className: "path"}, 
             paths
            )
        );
    }
});

module.exports = Path;

},{}],"./react/Path.jsx":[function(require,module,exports){
module.exports=require('tSjdzg');
},{}],"FNcvG+":[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react'),
    LimitSelect = require('./limitSelect.jsx'),

Product = React.createClass({displayName: 'Product',
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
                React.createElement("option", {value: this.props.specs[I].id}, this.props.specs[I].title)
            );
        }

        return (
React.createElement("div", null, 
 React.createElement("h1", null, this.props.title), 
 React.createElement("p", null, this.props.description), 
 React.createElement("span", null, "Price: ", React.createElement("i", null, "$"), React.createElement("b", null, this.props.price)), 
 React.createElement("div", null, "Pick a spec:", React.createElement("select", {onChange: this.handleSpecChange, value: this.state.selectedSpec}, specs), 
  React.createElement(LimitSelect, {max: max})
 )
)
        );
    }
});

module.exports = Product;

},{"./limitSelect.jsx":7}],"./react/Product.jsx":[function(require,module,exports){
module.exports=require('FNcvG+');
},{}],7:[function(require,module,exports){
module.exports=require("W+i0zc")
},{}]},{},["tSjdzg"])