var React = require('react');
var mui = require('material-ui');
var fs = require('fs');
var path = require('path');
var chips = require('../chips.js');

var $__0=     mui,Dialog=$__0.Dialog,TextField=$__0.TextField;

var RepoSetting = React.createClass({displayName: "RepoSetting",

	getInitialState:function() {
		return {
			remoteErrorText: '',
			localErrorText: ''
		};
	},

	componentDidMount:function() {
		var body = document.body;
		var holder = document.getElementById('localDir');
		body.ondrop = body.ondragover = body.ondragleave = body.ondragend = function()  { return false; };
		holder.ondragover = holder.ondragleave = holder.ondragend = function()  { return false; };
		holder.ondrop = function(e)  {
			e.preventDefault();
			var file = e.dataTransfer.files[0];
			this.refs.local.setValue(path.extname(file.path) ? path.dirname(file.path) : file.path);
			return false;
		}.bind(this);
	},

	componentWillUnmount:function() {
		var body = document.body;
		var holder = document.getElementById('localDir');
		holder.ondrop = holder.ondragover = holder.ondragleave = holder.ondragend = null;
		body.ondrop = body.ondragover = body.ondragleave = body.ondragend = null;
	},

	show:function() {
		this.refs.dialog.show();
	},

	close:function() {
		this.refs.dialog.dismiss();
		this.refs.remote.setValue('');
		this.refs.local.setValue('');
		this.setState({ remoteErrorText: '', localErrorText: '' });
	},

	render:function() {
		var actions = [
			{ text: '取消', onClick: this.close },
			{ text: '保存', onClick: this._onSubmit, ref: 'submit' }
		];
		return (
			React.createElement(Dialog, {ref: "dialog", title: "添加仓库信息", actions: actions, contentStyle: { maxWidth: 600}, modal: true}, 
				React.createElement(TextField, {ref: "remote", hintText: "示例: v3 or http://git.intra.tudou.com/static/v3.git", floatingLabelText: "远程仓库", fullWidth: true, errorText: this.state.remoteErrorText, style: { display: 'block', marginBottom: 10}, onChange: this._onRemoteChange}), 
				React.createElement(TextField, {ref: "local", hintText: "拖拽本地仓库文件夹到此处", floatingLabelText: "本地目录", fullWidth: true, errorText: this.state.localErrorText, onChange: this._onLocalChange, id: "localDir"})
			)
		);
	},

	_onRemoteChange:function() {
		this.setState({
			remoteErrorText: $.trim(this.refs.remote.getValue()) ? '' : '请填写远程仓库地址'
		});
	},

	_onLocalChange:function() {
		this.setState({
			localErrorText: $.trim(this.refs.local.getValue()) ? '' : '请填写本地仓库目录'
		});
	},

	_onSubmit:function() {
		var local = $.trim(this.refs.local.getValue() || '');
		var remote = $.trim(this.refs.remote.getValue() || '');
		var match = remote.match(/^(http|https)\:\/\/git.intra.tudou.com\/static\/(\w+)\.git$/);
		if (!(match && match[0])) {
			remote = 'http://git.intra.tudou.com/static/' + remote.replace(/\/\s/g, '') + '.git';
			match = remote.match(/^(http|https)\:\/\/git.intra.tudou.com\/static\/(\w+)\.git$/);
		}
		var data = { remote: remote, local: local, text: match && match[2] || '' };
		var check = chips.checkRepoInfo(data);

		if (remote == '') {
			this._onRemoteChange();
			this.refs.remote.focus();
			return;
		}
		if (!(match && match[0])) {
			this.setState({ remoteErrorText: '远程仓库地址格式错误' });
			this.refs.remote.focus();
			return;
		}
		if (check.remote) {
			this.setState({ remoteErrorText: '远程仓库地址重复' });
			this.refs.remote.focus();
			return;
		}
		if (local == '') {
			this._onLocalChange();
			this.refs.local.focus();
			return;
		}
		if (!fs.existsSync(local)) {
			this.setState({ localErrorText: '本地目录不存在' });
			this.refs.local.focus();
			return;
		}
		if (!fs.existsSync(local + path.sep + 'sdm-config.json')) {
			this.setState({ localErrorText: '请选择本地项目根目录' });
			this.refs.local.focus();
			return;
		} else {
			try {
				var localConfig = require(local + path.sep + 'sdm-config.json');
				if (localConfig.git_repository != remote) {
					this.setState({ localErrorText: '本地仓库与远程仓库信息不一致' });
					this.refs.local.focus();
					return;
				}
			} catch(e) {
				console.error(e.message);
			}
		}
		if (check.local) {
			this.setState({ localErrorText: '本地目录地址重复' });
			this.refs.local.focus();
			return;
		}

		data.gitUrl = data.remote.replace(/\.git/, '');
		data.configUrl = data.gitUrl + '/raw/master/sdm-config.json';

		if (this.props.onSubmit) {
			this.props.onSubmit(data);
			this.close();
		}
	}

});

module.exports = RepoSetting;
