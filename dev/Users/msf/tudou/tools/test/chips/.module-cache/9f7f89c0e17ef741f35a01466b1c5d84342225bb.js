var React = require('react');
var mui = require('material-ui');

var $__0=    mui,Dialog=$__0.Dialog;

var CustomDialog = React.createClass({displayName: "CustomDialog",

	getInitialState:function() {
		var actions = { text: '确定', onClick: this._onClick };
		return {
			title: '提示信息',
			message: '',
			onClick: function()  {},
			actions: [actions]
		};
	},

	show:function() {
		this.setState(this.state);
		this.refs.dialog.show();
	},

	close:function() {
		this.refs.dialog.dismiss();
	},

	alert:function(msg, content, callback) {
		if (callback == undefined) {
			callback = content;
			content = msg;
			msg = null;
		}
		this.state.title = msg || this.state.title;
		this.state.message = content || '';
		this.state.onClick = callback || this.state.onClick;
		this.state.actions = this.props.actions || this.state.actions;
		this.show();
	},

	confirm:function(msg, content, callback) {
		if (callback == undefined) {
			callback = content;
			content = msg;
			msg = null;
		}
		this.state.title = msg || this.state.title;
		this.state.message = content || '';
		this.state.onClick = callback || this.state.onClick;
		this.state.actions = this.props.actions || [
			{ text: '取消', onClick: this.close },
			{ text: '确定', onClick: this._onClick }
		];
		this.show();
	},

	render:function() {
		return (
			React.createElement(Dialog, {ref: "dialog", title: this.state.title, actions: this.state.actions, contentStyle: { maxWidth: 500}, modal: true}, this.state.message)
		);
	},

	_onClick:function(e) {
		if (this.state.onClick) {
			this.state.onClick(e);
			this.close();
		}
	}

});

module.exports = CustomDialog;
