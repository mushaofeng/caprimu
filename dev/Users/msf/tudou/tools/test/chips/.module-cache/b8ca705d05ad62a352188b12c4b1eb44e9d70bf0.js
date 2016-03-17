var React = require('react');
var mui = require('material-ui');

var $__0=     mui,Dialog=$__0.Dialog,TextField=$__0.TextField;

var UserSetting = React.createClass({displayName: "UserSetting",

	getInitialState:function() {
		return {
			userErrorText: '',
			passErrorText: ''
		};
	},

	show:function() {
		this.refs.dialog.show();
	},

	close:function() {
		this.refs.dialog.dismiss();
		if (this.props.userInfo) {
			this.refs.username.setValue($.trim(this.refs.username.getValue()) || this.props.userInfo.username);
			this.refs.password.setValue($.trim(this.refs.password.getValue()) || this.props.userInfo.password);
			this.setState({ userErrorText: '', passErrorText: '' });
		}
	},

	render:function() {
		if (this.props.userInfo && this.props.userInfo.username) {
			var actions = [
				{ text: '取消', onClick: this.close },
				{ text: '保存', onClick: this._onSubmit, ref: 'submit' }
			];
		} else {
			var actions = [
				{ text: '保存', onClick: this._onSubmit, ref: 'submit' }
			];
		}
		return (
			React.createElement(Dialog, {ref: "dialog", title: this.props.title, actions: actions, contentStyle: { maxWidth: 460}, modal: true}, 
				React.createElement(TextField, {hintText: "用户名", errorText: this.state.userErrorText, defaultValue: this.props.userInfo.username, style: { display: 'block', marginBottom: 10}, ref: "username", onChange: this._onUserChange}), 
				React.createElement(TextField, {hintText: "密码", errorText: this.state.passErrorText, ref: "password", onChange: this._onPassChange}, React.createElement("input", {type: "password", defaultValue: this.props.userInfo.password}))
			)
		);
	},

	_onUserChange:function() {
		this.setState({
			userErrorText: $.trim(this.refs.username.getValue()) ? '' : '请填写用户名'
		});
	},

	_onPassChange:function() {
		this.setState({
			passErrorText: $.trim(this.refs.password.getValue()) ? '' : '请填写密码'
		});
	},

	_onSubmit:function() {
		var username = $.trim(this.refs.username.getValue());
		var password = $.trim(this.refs.password.getValue());
		if (username == '') {
			this._onUserChange();
			this.refs.username.focus();
			return;
		}
		if (password == '') {
			this._onPassChange();
			this.refs.password.focus();
			return;
		}
		if (this.props.onSubmit) {
			this.props.onSubmit({ username: username, password: password });
			this.close();
		}
	}

});

module.exports = UserSetting;
