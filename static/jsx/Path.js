/** @jsx React.DOM */
var React = require('react'),

Path = React.createClass({displayName: 'Path',
    render: function () {
        var paths = this.props.path.map(function (P) {
            return (
                React.createElement("li", null, React.createElement("a", {href: '/cate/' + P.id}, P.title))
            );
        });
        return (
            React.createElement("ul", {className: "path"}, 
             paths
            )
        );
    }
});

module.exports = Path;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZWQuanMiLCJzb3VyY2VzIjpbbnVsbF0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFCQUFxQjtBQUNyQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDOztBQUU1QiwwQkFBMEIsb0JBQUE7SUFDdEIsTUFBTSxFQUFFLFlBQVk7UUFDaEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3pDO2dCQUNJLG9CQUFBLElBQUcsRUFBQSxJQUFDLEVBQUEsb0JBQUEsR0FBRSxFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBRSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUksQ0FBQSxFQUFDLENBQUMsQ0FBQyxLQUFVLENBQUssQ0FBQTtjQUNsRDtTQUNMLENBQUMsQ0FBQztRQUNIO1lBQ0ksb0JBQUEsSUFBRyxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxNQUFPLENBQUEsRUFBQTthQUNuQixLQUFNO1lBQ0gsQ0FBQTtVQUNQO0tBQ0w7QUFDTCxDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcblxuUGF0aCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhdGhzID0gdGhpcy5wcm9wcy5wYXRoLm1hcChmdW5jdGlvbiAoUCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj17Jy9jYXRlLycgKyBQLmlkfT57UC50aXRsZX08L2E+PC9saT5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInBhdGhcIj5cbiAgICAgICAgICAgICB7cGF0aHN9XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhdGg7XG4iXX0=