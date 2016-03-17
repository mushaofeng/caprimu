var Path = require('path');
var Fs = require('fs');
var Ssh = require('ssh2');
var client = require('scp2');

var chips = require('./chips.js');

// 中转服务器信息
var mgr3 = {
	host : '10.25.251.101',
	user : 'zhangfeng',
	pass : 'zfff0804',
	root : '/home/zhangfeng/'
};


function connectManage3(sshConfig){
	var ssh = new Ssh();

	ssh.on('connect', function() {
		console.log('[Manage3] 连接到 ' + sshConfig.host);
	});

	ssh.on('error', function(err) {
		console.error('[Manage3] ' + err);
	});

	ssh.on('close', function(had_error) {
		// console.info('[Manage3] disconnect');
	});

	ssh.connect({
		host: sshConfig.host,
		port: sshConfig.port,
		username: sshConfig.user,
		password: sshConfig.pass,
	});

	return ssh;
}

// 通过代理上传模板
function uploadTemplate4Mgr3(config, path){

	var fileName = Path.basename(path);
	var relativePath = Path.relative(config.localRoot, path).split(Path.sep).join('/');

	var options = {
		host: mgr3.host,
		username: mgr3.user,
		password: mgr3.pass,
		port: mgr3.port || 22,
		path: mgr3.root
	};

	console.log('准备发布: ' + path);

	client.scp(path, options, function(err){
		if (err) {
			console.error('[上传到中转] 失败:' + err);
			return;
		}

		console.info('[上传到中转] 成功');

		var manage3 = connectManage3(mgr3);
		var destConn = new Ssh();

		var remotePath = config.root + relativePath;

		manage3.on('ready', function(){

			var cmd = ['nc', config.host, config.port || 22].join(' ');

			manage3.exec(cmd, function(err, stream){
				if (err) {
					console.error('[发布到服务器] 失败 ' + err);
					return manage3.end();
				}
				destConn.connect({
					sock: stream,
					username: config.user,
					password: config.pass
				});
			});

			cmd = ['cat', fileName, '|', 'nc', '-l', '7777'].join(' ');
			manage3.exec(cmd, function(err, stream){
				if (err) {
					console.error('[发布到服务器] 失败 ' + err);
					return manage3.end();
				}
				console.log(path + ' ->');
			});

		});

		destConn.on('ready', function(){

			var cmd = ['nc', mgr3.host, '7777', '>', remotePath].join(' ');

			destConn.exec(cmd, function(err, stream){
				if (err) {
					console.error('[发布到服务器] 失败 ' + err);
					return manage3.end();
				}
				console.log(remotePath);

				stream.on('data', function(data, extended) {
					if (extended === 'stderr') {
						console.error(data.toString());
					} else {
						console.log(data.toString());
					}
				});

				stream.on('exit', function(code, signal) {
					if (code == 0) {
						console.info('[发布到服务器] 成功');
					}
					manage3.end();
					destConn.end();
				});
			});

		});

	});
}


function uploadTemplate(config, path){

	var fileName = Path.basename(path);
	var relativePath = Path.relative(config.localRoot, path).split(Path.sep).join('/');

	var options = {
		host: config.host,
		username: config.user,
		password: config.pass,
		port: config.port || 22,
		path: config.root + relativePath
	};

	console.log('准备发布: ' + path);

	client.scp(path, options, function(err){
		if (err) {
			console.error('[发布到服务器] 失败:' + err);
			return;
		}

		console.info('[发布到服务器] 成功');
	});
}


module.exports.publish = function(path, project, env){
	var serverInfo = chips.getServerInfo();
	var config = serverInfo[project] && serverInfo[project][env] || null;
	if (!config) {
		console.error('未找到模版配置信息');
		return;
	}
	config.localRoot = chips.getProject(project).path;
	if (config.noManage3 === true) {
		uploadTemplate(config, path);
	} else {
		uploadTemplate4Mgr3(config, path);
	}
};
