var FS = require('fs');
var Path = require('path');
var Iconv = require('iconv-lite');
var Crypto = require('crypto');
var Request = require('request');
var ChildProcess = require('child_process');
var UglifyJS = require('uglify-js');
var CleanCss = require('clean-css');

var banner = '/**\n' +
	' * @modified $Author$\n' +
	' * @version $Rev$\n' +
	' */\n';

// 执行cmd命令
function execCmd(cmd, options, stdoutFn, stderrFn, closeFn, noErrorLog) {
	if (!noErrorLog) {
		infoLog(cmd);
	}
	var command = '';
	if (process.platform === 'win32') {
		command = 'set LANG=en_US & ';
	} else {
		command = 'export LANG=en_US; ';
	}
	command += cmd;
	var cp = ChildProcess.exec(command, options);
	cp.stdout.on('data', function(stdout) {
		stdoutFn && stdoutFn(stdout);
	});
	cp.stderr.on('data', function(stderr) {
		if (!noErrorLog) {
			if (/^git /.test(cmd)) {
				infoLog(stderr);
			} else {
				errorLog(stderr);
			}
		}
		stderrFn && stderrFn(stderr);
	});
	cp.on('close', function() {
		closeFn && closeFn();
	});
}

function mkdir(dirPath, mode) {
	var list = [];
	while (true) {
		if (FS.existsSync(dirPath)) {
			break;
		}
		list.push(dirPath);
		var parentPath = Path.dirname(dirPath);
		if (parentPath == dirPath) {
			break;
		}
		dirPath = parentPath;
	}
	list.reverse().forEach(function(path) {
		FS.mkdirSync(path, mode);
	});
}

function readFile(filePath, encoding) {
	var buffer = FS.readFileSync(filePath);
	if (!encoding) {
		return buffer;
	}
	var fileStr = Iconv.fromEncoding(buffer, encoding);
	return fileStr;
}

function writeFile(filePath, content) {
	mkdir(Path.dirname(filePath), '0777');
	FS.writeFileSync(filePath, content);
}

function copyFile(fromPath, toPath) {
	var buffer = readFile(fromPath);
	writeFile(toPath, buffer);
}

function readRemoteFile(url, encoding, callback) {
	Request({
		url : url,
		encoding : null
	}, function (error, response, buffer) {
		if (!error && response.statusCode == 200) {
			if (encoding) {
				buffer = Iconv.fromEncoding(buffer, encoding);
			}
			callback(buffer);
		} else {
			errorLog('请求URL失败：' + url);
		}
	});
}

function escapePath(path) {
	return path.replace(/\\/g, '\\\\');
}

// 转换成相对路径
function getRelativePath(rootPath, path) {
	var dirPath = Path.resolve(rootPath);
	return Path.relative(dirPath, path).split(Path.sep).join('/');
}

// 获取目录文件
function grepPaths(rootDirPath, deep, checkFn) {
	deep = deep === undefined ? true : deep;
	checkFn = checkFn || function() {
		return true;
	};
	var paths = [];
	function walk(dirPath) {
		var files = FS.readdirSync(dirPath);
		for (var i = 0, len = files.length; i < len; i++) {
			var file = files[i];
			if (file.charAt(0) === '.') {
				continue;
			}
			var path = Path.resolve(dirPath + '/' + file);
			var stat = FS.statSync(path);
			if (stat.isDirectory()) {
				deep && walk(path);
			} else if (checkFn(path)) {
				paths.push(path);
			}
		}
	}
	if (FS.existsSync(rootDirPath)) {
		walk(rootDirPath);
	}
	return paths;
}

// 根据目录规则获取文件列表
function grepFiles(rootDirPath, rules) {
	var paths = {};
	for (var i = 0; i < rules.length; i++) {
		var rule = rules[i];
		var match;
		if ((match = /^(.*)\/\*\*/.exec(rule))) {
			grepPaths(Path.join(rootDirPath, match[1]), true).forEach(function(path) {
				paths[path] = true;
			});
		} else if ((match = /^(.*)\/\*/.exec(rule))) {
			grepPaths(Path.join(rootDirPath, match[1]), false).forEach(function(path) {
				paths[path] = true;
			});
		} else {
			var path = Path.join(rootDirPath, rule);
			paths[path] = true;
		}
	}
	return Object.keys(paths);
}

// MD5
function md5(data){
	if (!data) {
		return '';
	}
	var md5sum = Crypto.createHash('md5');
	var encoding = typeof data === 'string' ? 'utf8' : 'binary';
	md5sum.update(data, encoding);
	return md5sum.digest('hex');
}

// 比较本地和远程文件
function compareFile(path, contentA, contentB) {
	if (/\.(js|css)$/.test(path)) {
		var matchA = /\* @version \$Rev: (\w+) \$/.exec(contentA);
		var matchB = /\* @version \$Rev: (\w+) \$/.exec(contentB);
		var revisionA = matchA ? matchA[1] : '';
		var revisionB = matchB ? matchB[1] : '';
		infoLog('[对比头部版本] ' + path + '，本地：' + revisionA.substring(0, 7) + '，服务器：' + revisionB.substring(0, 7));
		return revisionA === revisionB;
	}
	var md5A = md5(contentA);
	var md5B = md5(contentB);
	infoLog('[对比文件MD5] ' + path + '，本地：' + md5A.substring(0, 7) + '，服务器：' + md5B.substring(0, 7));
	return md5A === md5B;
}

// 添加头部注释
function addBanner(content, commitHash, author) {
	if (!/^\/\*\*/.test(content)) {
		content = banner + content;
	}
	content = content.replace(/(\* @modified \$Author)(?:: [^\$]+ )?(\$)/, '$1: ' + author + ' $2');
	content = content.replace(/(\* @version \$Rev)(?:: \w+ )?(\$)/, '$1: ' + commitHash + ' $2');
	return content;
}

function minJs(content) {
	var result = UglifyJS.minify(content, {
		fromString : true,
		compress : {
			sequences : false,
			properties : false,
			dead_code : false,
			conditionals : false,
			comparisons : false,
			evaluate : false,
			booleans : false,
			loops : false,
			unused : false,
			hoist_funs : false,
			hoist_vars : false,
			if_return : false,
			join_vars : false,
			cascade : false,
		}
	});
	return result.code + ';';
}

function minCss(content) {
	return CleanCss.process(content);
}

function showLog(str, fix) {
	console.log(str);
}

function infoLog(str, fix) {
	console.log(str);
}

function successLog(str, fix) {
	console.info(str);
}

function warnLog(str, fix) {
	console.warn(str);
}

function errorLog(str, fix) {
	console.error(str);
}


module.exports = {
	execCmd: execCmd,
	mkdir: mkdir,
	readFile: readFile,
	writeFile: writeFile,
	copyFile: copyFile,
	readRemoteFile: readRemoteFile,
	getRelativePath: getRelativePath,
	escapePath: escapePath,
	grepPaths: grepPaths,
	grepFiles: grepFiles,
	compareFile: compareFile,
	addBanner: addBanner,
	minCss: minCss,
	minJs: minJs
};
