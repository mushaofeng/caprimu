var React = require('react');
var mui = require('material-ui');

var $__0=       mui,Dialog=$__0.Dialog,List=$__0.List,ListItem=$__0.ListItem,Checkbox=$__0.Checkbox;

var styles = {
	list: {
		minHeight: 250,
		maxHeight: 450,
		overflow: 'auto',
		border: '1px solid #eee',
		padding: '10px 0'
	},
	listItem: {
		padding: '9px 0 9px 50px'
	},
	checkbox: {
		top: 4, left: 12
	}
};

var FileCheckList = React.createClass({displayName: "FileCheckList",

	getInitialState:function() {
		return {
			title: '发布列表',
			filelist: []
		};
	},

	show:function(options) {
		options || (options = {});
		this.setState(options);
		this.refs.dialog.show();
	},

	close:function() {
		this.refs.dialog.dismiss();
	},

	render:function() {
		var actions = [
			{ text: '取消', onClick: this.close },
			{ text: this.state.btnName || '确认', onClick: this._onSubmit, ref: 'submit' }
		];
		return (
			React.createElement(Dialog, {
				ref: "dialog", 
				title: this.state.title, 
				actions: actions, 
				actionFocus: "submit", 
				modal: true}, 
				React.createElement(List, {style: styles.list}, 
				
					this.state.filelist.map(function(item, index)  {
						return React.createElement(ListItem, {style: styles.listItem, key: index, leftCheckbox: React.createElement(Checkbox, {defaultChecked: item.checked, "data-index": index, onCheck: this._onCheck, ref: 'fileItem' + index, style: styles.checkbox})}, item.path);
					}.bind(this))
				
				)
			)
		);
	},

	_onCheck:function(e, checked) {
		var $target = $(e.target);
		var index = $target.attr('data-index');
		this.state.filelist[index].checked = checked;
		this.refs['fileItem' + index].setChecked(checked);
		this.setState(this.state);
	},

	_onSubmit:function() {
		var list = this.state.filelist;
		var checked = list.filter(function(item)  {
			if (item.checked) {
				return item;
			}
		});
		if (this.state.callback) {
			this.state.callback(checked);
		}
		if (this.props.onSubmit) {
			this.props.onSubmit(checked);
		}
	}

});

module.exports = FileCheckList;
