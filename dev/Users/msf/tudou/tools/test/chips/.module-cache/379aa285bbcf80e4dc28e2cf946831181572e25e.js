var React = require('react');
var mui = require('material-ui');
var chips = require('../chips.js');

var $__0=     mui,Dialog=$__0.Dialog,Table=$__0.Table;

var styles = {
	dropDown: {
		height: 45,
		marginRight: 10,
		lineHeight: '45px'
	},
	dropMenu: {
		width: '250px !important',
		maxHeight: 300
	},
	label: {
		display: 'inline-block',
		verticalAlign: 'top',
		lineHeight: '60px',
		textIndent: '10px'
	},
	rowProject: {
		width: '18%',
		maxWidth: 'auto',
		padding: '0 5px !important',
		textAlign: 'center',
		fontSize: 15
	},
	rowLong: {
		width: '75%',
		padding: '0 5px !important',
		fontSize: 15
	}
};

var TemplateSetting = React.createClass({displayName: "TemplateSetting",

	getInitialState:function() {
		return {
			title: '选择模版发布到',
			rowData: this._getRowData()
		};
	},

	show:function(options) {
		options || (options = {});
		this.state.rowData = this._getRowData();
		this.setState(options);
		this.refs.dialog.show();
	},

	close:function() {
		this.refs.dialog.dismiss();
	},

	render:function() {
		var colOrder = ['project', 'root']
		var headerCols = {
			project: { content: '项目', style: styles.rowProject },
			root: { content: '远程目录', style: styles.rowLong }
		};
		var actions = [
			{ text: '取消', onClick: this.close },
			{ text: '保存', onClick: this._onSubmit, ref: 'submit' }
		];
		return (
			React.createElement(Dialog, {
				ref: "dialog", 
				contentStyle: { minWidth: 900}, 
				title: this.state.title, 
				actions: actions, 
				actionFocus: "submit", 
				modal: true}, 
				React.createElement(Table, {
					rowData: this.state.rowData, 
					columnOrder: colOrder, 
					headerColumns: headerCols, 
					height: '360px', 
					showRowHover: true, 
					selectable: true, 
					deselectOnClickaway: false, 
					onRowSelection: this._onRowSelection})
			)
		);
	},

	_getRowData:function() {
		var serverlist = [];
		var serverInfo = chips.getServerInfo();
		var projectInfo = chips.getProject();
		this._serverInfo = serverInfo;
		for (var project in serverInfo) {
			var data = serverInfo[project];
			var env = data['wwwtest'] || data['dev'] || data['yufa'] || {};
			if (!projectInfo[project]) {
				serverlist.push({
					project: { content: project, style: styles.rowProject },
					root: { content: env.root || '', style: styles.rowLong }
				});
			}
		}
		return serverlist;
	},

	_onRowSelection:function(selectRow) {
		this._selectRow = selectRow && selectRow[0];
	},

	_onSubmit:function() {
		if (!this._selectRow) return;
		var selectRowData = this.state.rowData[this._selectRow];
		var projectInfo = {
			path: this.state.path,
			name: selectRowData.project.content,
			data: this._serverInfo[selectRowData.project.content]
		};
		if (this.state.callback) {
			this.state.callback(projectInfo);
		}
		if (this.props.onSubmit) {
			this.props.onSubmit(projectInfo);
		}
		this.close();
		return;
	}

});

module.exports = TemplateSetting;
