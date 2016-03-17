var Path = require('path');

var uniqueID = 0;

var _console = {};
_console.log = console.log;
_console.info = console.info;
_console.warn = console.warn;
_console.error = console.error;

var Console = React.createClass({displayName: "Console",

	getInitialState:function() {
		return { id: uniqueID++ };
	},

	componentDidMount:function() {
		if (this.isMounted()) {
			this.init();
			if (this.props.listen) {
				this.listen();
			}
		}
	},

	init:function() {
		var style = this.props.style;
		var iframe = React.findDOMNode(this.refs[this.state.id]);
		var consoleWin = this.consoleWin = iframe.contentWindow;
		var consoleDoc = this.consoleDoc = consoleWin.document;
		var consoleHead = this.consoleHead = consoleDoc.getElementsByTagName('head')[0];
		var consoleBody = this.consoleBody = consoleDoc.body;
		var consoleStyle = consoleDoc.createElement('style');
		// var font = 'file://' + Path.resolve(__dirname, '../../../src/css/font/PingHei-light.woff');
		consoleStyle.setAttribute('type', 'text/css');
		consoleStyle.innerHTML =
			// '@font-face { font-family: "PingHei"; font-style: normal; src: url("' + font + '") format("woff"); }' +
			'body { background: transparent; font-family: PingHei, Consolas, Monaco, "Lucida Console", monospace, sans-serif; font-size: ' + (style && style.fontSize ? style.fontSize : '0.75rem') + '; }' +
			'li { margin: 0; line-height: 1.1rem; list-style: none; word-break: break-all; }' + (this.props.dark ?
			'body { background: #202430; color: #ccc; }' +
			'li.info { color: #70c243; }' +
			'li.warn { color: #e0a229; }' +
			'li.error { color: #d60922; }' :
			'body { color: #808080; }' +
			'li.info { color: #42a00e; }' +
			'li.warn { color: #e9900a; }' +
			'li.error { color: #e05566; }');
		consoleHead.appendChild(consoleStyle);
		this.isListen = false;

		consoleBody.ondrop = consoleBody.ondragover = consoleBody.ondragleave = consoleBody.ondragend = function()  { return false; };
	},

	listen:function() {
		console.log = function()  { this._log('log', arguments); }.bind(this);
		console.info = function()  { this._log('info', arguments); }.bind(this);
		console.warn = function()  { this._log('warn', arguments); }.bind(this);
		console.error = function()  { this._log('error', arguments); }.bind(this);
		this.isListen = true;
	},

	stopListen:function() {
		console.log = _console.log;
		console.info = _console.info;
		console.warn = _console.warn;
		console.error = _console.log;
		this.isListen = false;
	},

	log:function() {
		this._log('log', arguments);
	},

	info:function() {
		this._log('info', arguments);
	},

	warn:function() {
		this._log('warn', arguments);
	},

	error:function() {
		this._log('error', arguments);
	},

	clear:function() {
		this.consoleBody.innerHTML = '';
	},

	isEmpty:function() {
		return this.consoleBody.innerHTML == '';
	},

	_log:function(type, args) {
		var messages = $.makeArray(args);
		var line = this.consoleDoc.createElement('li');
		line.innerHTML = messages.join('').replace(/\n/g, '<br>').replace(/(\[\d+m)/g, '');
		if (type != 'log') {
			line.className = type;
		}
		var consoleBody = this.consoleBody;
		consoleBody.appendChild(line);
		consoleBody.scrollTop = consoleBody.scrollHeight;
	},

	render:function() {
		return (
			React.createElement("div", {style: this.props.style}, 
				React.createElement("iframe", {className: "console", ref: this.state.id, width: "100%", height: "100%", allowTransparency: "true", style: { border: 0, background: '#fff', boxShadow: '-3px 0 30px rgba(0,0,0,0.05) inset'}})
			)
		);
	}

});

module.exports = Console;
