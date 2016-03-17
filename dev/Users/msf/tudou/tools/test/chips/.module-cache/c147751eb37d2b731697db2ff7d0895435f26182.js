var React = require('react');
var Tappable = require('./tappable.js');

var Menu = React.createClass({displayName: "Menu",

	render:function() {
		return (
			React.createElement("div", {className: "menu"}, 
				 this.props.menuItems.map(function(repo, index)  {
					return (
						React.createElement(Tappable, {key: index, onTap: this._onTap, onPress: this._onPress}, 
							React.createElement("a", {href: "#", "data-index": index, className: this.props.selectedIndex == index ? 'current' : ''}, repo.text)
						)
					);
				}.bind(this)) 
			)
		);
	},

	_onTap:function(e) {
		var index = $(e.target).attr('data-index');
		if (this.props.onItemTap) {
			this.props.onItemTap(e, index);
		}
	},

	_onPress:function(e) {
		var index = $(e.target).attr('data-index');
		if (this.props.onItemPress) {
			this.props.onItemPress(e, index);
		}
	}

});

module.exports = Menu;
