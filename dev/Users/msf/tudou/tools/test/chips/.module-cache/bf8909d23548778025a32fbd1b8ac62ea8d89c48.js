var FS = require('fs');
var Path = require('path');
var Iconv = require('iconv-lite');
var Request = require('request');
var Ftp = require('jsftp');
var Ssh = require('ssh2');
var Imagemin = require('imagemin');
var Archiver = require('archiver');
var Rimraf = require('rimraf');
var remote = require('remote');
var dialog = remote.require('dialog');

var {
    execCmd,
	mkdir,
	readFile,
	writeFile,
	copyFile,
	readRemoteFile,
	getRelativePath,
	escapePath,
	grepPaths,
	grepFiles,
	compareFile,
	addBanner,
	minCss,
	minJs
} = require('./util.js');

var defaultConfig = {
    saveas_path: '',    // 文件保存路径
    recent_data: {},    // 用户选项记录
    user_data: {},      // 用户信息
    repo_data: [],      // 仓库数据
    repo_cur: 0,        // 当前仓库名
    hrt_port: 7777,     // 代理端口
    hrt_debug: false,   // 调试模式
    hrt_silent: true    // 安静模式
};

var homePath = process.env.HOME || process.env.LOCALAPPDATA;
var userPath = homePath + Path.sep + '.chips';
var dataPath = userPath + Path.sep + 'data'; // 代码目录
var tempPath = userPath + Path.sep + 'temp'; // 临时目录
var filesPath = tempPath + Path.sep + 'files';
var zipFileName = 'uiversion.zip';
var zipFilePath = tempPath + Path.sep + zipFileName;
var zipFilesPath = tempPath + Path.sep + 'zip_files';
var configFile = userPath + Path.sep + 'config.json';
var projectFile = userPath + Path.sep + 'project.json';

var cloneFolderName, repoPath;

initUserData();

var appConfig = getAppConfig();
var projectData = getProjectData();

// 创建用户数据目录
function initUserData() {
	alert(111)
    if (!FS.existsSync(userPath)) {
    	mkdir(userPath);
    	mkdir(dataPath);
    	mkdir(filesPath);
    	mkdir(zipFilesPath);
    }
}

// 初始化App配置文件
function initConfig(){
    var configData = JSON.stringify(defaultConfig);
    localStorage.setItem('appConfig', configData);
    FS.writeFileSync(configFile, configData);
}

// 更新App配置信息
function saveAppConfig(){
    var configData = JSON.stringify(appConfig);
    localStorage.setItem('appConfig', configData);
    FS.writeFileSync(configFile, configData);
}

// 获取App配置信息
function getAppConfig(){
    if (!FS.existsSync(configFile)) {
        initConfig();
        return defaultConfig;
    }
    var content;
    try {
        content = JSON.parse(readFile(configFile));
    } catch(e) {
        content = JSON.parse(localStorage.getItem('appConfig'));
    }
    return content;
}

function getConfig(){
    return appConfig;
}

// 初始化项目模版配置文件
function initProjectData(){
    FS.writeFileSync(projectFile, JSON.stringify({}));
}

// 更新项目模版配置信息
function saveProjectData(){
    FS.writeFileSync(projectFile, JSON.stringify(projectData));
}

// 获取项目模版配置信息
function getProjectData(){
    if (!FS.existsSync(projectFile)) {
        initProjectData();
        return {};
    }
    return JSON.parse(readFile(projectFile));
}

function setProject(name, data){
    projectData[name] = data || {};
    saveProjectData();
}

function getProject(name){
    if (name) {
        return projectData && projectData[name] || null;
    } else {
        return projectData || null;
    }
}

// 删除指定模版配置信息
function removeProject(name) {
    if (name && getProject(name)) {
        projectData[name] = null;
        delete projectData[name];
        saveProjectData();
    }
}

// 获取上次选项信息
function getRecentData(name){
    return appConfig.recent_data[name] || {};
}

// 保存上次选项信息
function saveRecentData(name, data){
    appConfig.recent_data[name] = data;
    saveAppConfig();
}

function getCloneFolder(){
    return cloneFolderName;
}

// 获取clone的仓库路径
function getRepoPath(){
    return repoPath;
}

// 设置clone仓库目录
function setRepoPath(folder){
    cloneFolderName = folder;
    repoPath = dataPath + Path.sep + cloneFolderName;
}

// 获取用户信息
function getUserInfo(){
    return appConfig.user_data;
}

// 设置用户信息
function setUserInfo(info){
    appConfig.user_data = info;
    saveAppConfig();
}

// 检查用户信息
function checkUserInfo(){
    var userInfo = getUserInfo();
    if (userInfo && userInfo.username && userInfo.password) {
        return true;
    } else {
        return false;
    }
}

// 获取仓库信息
function getRepoInfo(){
    return appConfig.repo_data.slice(0);
}

// 检查仓库信息
function checkRepoInfo(info){
    var has = { remote: false, local: false };
    appConfig.repo_data.forEach((repo, i) => {
        if (repo.remote == info.remote) {
            return has.remote = true;
        }
        if (info.local.indexOf(repo.local) > -1) {
            return has.local = true;
        }
    });
    return has;
}

// 添加仓库信息
function addRepoInfo(info){
    appConfig.repo_data.push(info);
    saveAppConfig();
}

// 删除仓库信息
function removeRepoInfo(info){
    var index = 0;
    appConfig.repo_data.forEach((repo, i) => {
        if (repo.remote == info.remote) {
            index = i;
            return true;
        }
    });
    appConfig.repo_data.splice(index, 1);
    saveAppConfig();
}

// 检查远程配置文件
function checkRemote(url, callback){
    readRemoteFile(url, 'utf-8', function(str) {
    	try {
    		var config = JSON.parse(str);
    	} catch(e) {
    		console.error('配置文件格式错误：' + url);
    		return;
    	}
        callback && callback(config);
    });
}

// 检测git命令
function checkGit(passCallback, errorCallback){
    execCmd('git --version', null, function(stdout){
        passCallback && passCallback(stdout);
    }, function(stderr){
        errorCallback && errorCallback(stderr);
    }, null, true);
}

// 获取远程分支信息
function getBranch(git_repo, callback){
    execCmd('git ls-remote ' + git_repo, null, function(stdout){
        var branches = {};
        var line = stdout.split(/\n/g);
        line.forEach(function(item, index){
            var key = item.match(/^\w+\s+(.+)$/);
            if (key && key[1]) {
                key = key[1];
                if (key == 'HEAD') {
                    key = 'master';
                } else {
                    key = key.replace(/^refs\/heads\//, '');
                }
                branches[key] = true;
            }
        });
        if (callback) {
            callback(branches);
        }
    }, function(stderr) {
        console.error(stderr);
    }, null, true);
}

// 切换分支、更新代码
function pullRemote(branch, callback) {

	function pull() {
		execCmd('git reset --hard origin/' + branch, {cwd : repoPath}, null, null, function() {
			execCmd('git pull origin ' + branch, {cwd : repoPath}, function(stdout) {
				console.info(stdout);
			}, null, callback);
		});
	}

	var isClone = !FS.existsSync(repoPath);

	if (!isClone) {
		var cmd = 'git branch ' + branch + ' origin/' + branch;
		var cwd = repoPath;
	} else {
		// mkdir(dataPath, '0777');
		var cmd = 'git clone ' + CONFIG.git_repository + ' ' + cloneFolderName + ' --branch ' + branch;
		var cwd = dataPath;
	}

	execCmd(cmd, {cwd : cwd}, function(stdout) {
		// console.log(stdout);
	}, null, function() {
		if (isClone) {
			pull();
		} else {
			execCmd('git checkout ' + branch, {cwd : repoPath}, function(stdout) {
				console.log(stdout);
			}, null, pull);
		}
	}, !isClone);
}

// 优化图片
function optimizeImg(sourcePath, distPath, callback) {
    if (!/\.(png|jpg|jpeg|gif)$/i.test(distPath)) {
        callback(true);
        return;
    }

    var srcContent = readFile(sourcePath);

    var imagemin = new Imagemin()
        .src(sourcePath)
        .dest(Path.dirname(distPath))
        .use(Imagemin.gifsicle())
        .use(Imagemin.jpegtran(true))
        .use(Imagemin.optipng({ optimizationLevel: 3 }))
        .use(Imagemin.svgo({plugins: [{removeViewBox: false}]}));

    imagemin.run(function(err, files) {
        if (err) {
            console.error('[压缩图片] 失败 ' + err);
            callback(true);
            return;
        }
        var saved = srcContent.length - files[0].contents.length;
        var savedMsg = saved > 0 ? '节省 ' + (Math.round(saved / 1024 * 100) / 100) + 'KB' : '图片已压缩优化';
        console.info('[压缩图片] ' + distPath + ' (' + savedMsg + ')');
        callback();
    });
}

// 目标文件复制到temp目录，添加commit hash
function extractFiles(paths, callback, failCallback) {
	Rimraf.sync(filesPath);
	mkdir(filesPath, '0777');
	console.info('复制文件 ...');

	var toPaths = [];

	function exec() {
		if (paths.length < 1) {
			callback(toPaths);
			return;
		}
		var path = paths.shift();
		var relativePath = Path.relative(repoPath, path);
		var distRelativePath = relativePath.replace(/^build/, 'dist');
		var toPath = Path.join(filesPath, cloneFolderName, distRelativePath);
        if (/\.(psd|psb)$/.test(path)) {
            exec();
            return;
        }
		if (!/\.(js|css)$/.test(path)) {
            copyFile(path, toPath);
            toPaths.push(toPath);
            exec();
			return;
		}
		execCmd('git log -1 --pretty="%H %an" "' + escapePath(relativePath) + '"', {cwd : repoPath}, function(stdout) {
			// console.log('git log ', stdout);

			if (!stdout) {
				console.error('commit hash获取失败，未返回stdout：' + path);
                failCallback && failCallback();
				return;
			}
			var match = /^(\w+)\s+(.+)$/.exec(stdout.trim());
			if (!match) {
				console.error('commit hash获取失败，格式不正确：' + path);
                failCallback && failCallback();
				return;
			}

			var commitHash = match[1];
			var author = match[2];
			var content = readFile(path, 'utf-8');

            if (/<<<<<\s+HEAD/g.test(content)) {
                console.error('文件存在冲突: ', path);
                failCallback && failCallback();
                return;
            }
			if (/\.js$/.test(path)) {
				content = minJs(content);
			} else {
				content = minCss(content);
			}
			content = addBanner(content, commitHash, author);
			writeFile(toPath, content);
            console.log('生成文件:', path);
			toPaths.push(toPath);
			exec();
		}, function(stderr){
			exec();
		}, null, true);
	}
	exec();
}

// 把未上线的文件复制到指定目录
function getTargetFiles(paths, envConfig, callback) {
	var versionUrl = envConfig.version_url;

	console.log('请求URL: ' + versionUrl);

	readRemoteFile(versionUrl, 'utf-8', function (versionContent) {

		var versionList = versionContent.split(/\n|\r\n/);
		var remotePathMap = {};
		versionList.forEach(function(row) {
			var arr = row.split('=');
			remotePathMap[arr[0]] = arr[1];
		});

		var targetPaths = [];

		function exec() {
			if (paths.length < 1) {
				callback(targetPaths);
				return;
			}
			var path = paths.shift();
			var relPath = getRelativePath(Path.join(filesPath, cloneFolderName), path);
			var absPath = '/' + cloneFolderName + '/' + relPath;
			var url = envConfig.domain + '/' + relPath;
			if (!/\.(js|css|html)$/.test(path)) {
				if (remotePathMap[absPath]) {
					exec();
					return;
				}
			}
			console.log('develop:url' +url );
			Request(url + '?t=' + Date.now(), function (error, response, content) {
				if (!response) {
					console.error('请求URL: ' + url + ' [超时] ' + paths.length);
				} else {
					console.log('请求URL: ' + url + ' [' + response.statusCode + ']');
					if (response.statusCode == 404) {
						console.warn('未上线文件：' + relPath);
						targetPaths.push(path);
					} else {
						if (/\.(js|css|html)$/.test(path)) {
							var localContent = readFile(path, 'utf-8');
							if (!compareFile(relPath, localContent, content)) {
								console.warn('文件不一致：' + relPath);
								targetPaths.push(path);
							}
						}
					}
				}
				exec();
			});
		}
		exec();
	});
}

// Update static version
// @param env: "beta", "wwwtest"
function updateVersion(sshConfig, env, callback) {
	var ssh = new Ssh();

	ssh.on('connect', function() {
		console.log('[SSH] 连接服务器: ' + sshConfig.host);
	});

	ssh.on('ready', function() {
		var cmd = '/usr/bin/python ' + sshConfig.root + '/updatever.py ' + env;

		console.log('[SSH] ' + cmd);

		ssh.exec(cmd, function(err, stream) {
			if (err) {
				console.error('[SSH] ' + err);
				return;
			}
			stream.on('data', function(data, extended) {
				if (extended === 'stderr') {
					console.error('[SSH] ' + data.toString());
				} else {
					console.log(data.toString());
				}
			});
			stream.on('exit', function(code, signal) {
				ssh.end();
			});
		});
	});

	ssh.on('error', function(err) {
		console.error('[SSH] ' + err);
	});

	ssh.on('close', function(had_error) {
		console.info('[SSH] 版本化成功');
		console.info('发布成功');
        callback && callback();
	});

	ssh.connect({
		host: sshConfig.host,
		port: sshConfig.port,
		username: sshConfig.user,
		password: sshConfig.pass,
	});
}

// FTP上传
function uploadByFtp(ftpConfig, sshConfig, paths, env, successCallback) {
	var roots = [ftpConfig.root, ftpConfig.root2];
	var queue = [];
	paths.forEach(function(localPath) {
		var relativePath = Path.relative(filesPath, localPath).split(Path.sep).join('/');
		roots.forEach(function(root) {
			var remotePath = root + '/' + relativePath;
			queue.push([localPath, remotePath]);
		});
	});

	console.log('[FTP] 连接服务器: ' + ftpConfig.host);

	var ftp = new Ftp(ftpConfig);

	function mkdir(dirPath, callback) {
		var list = [];

		function makeDir() {
			if (list.length < 1) {
				callback();
				return;
			}
			var path = list.pop();
			console.log('[FTP] 创建目录: ' + path);
			ftp.raw.mkd(path, function(err, data) {
				if (err) {
					console.error('[FTP] ' + err);
					return;
				}
				makeDir();
			});
		}

		function checkDir(dirPath) {
			// console.log('[FTP] 检查目录: ' + dirPath);
			var parentPath = Path.dirname(dirPath);
			if (parentPath == dirPath) {
				makeDir();
				return;
			}
			var basename = Path.basename(dirPath);
			ftp.ls(parentPath, function(err, res) {
				var exists = false;
				res.forEach(function(obj) {
					if (obj && basename == obj.name) {
						exists = true;
						return;
					}
				});
				if (!exists) {
					list.push(dirPath);
					checkDir(parentPath);
				} else {
					makeDir();
				}
			});
		}

		checkDir(dirPath);
	}

	function upload() {
		if (queue.length < 1) {
			ftp.raw.quit(function(err) {
				if (err) {
					console.error('[FTP] ' + err);
					return;
				}
				console.info('开始版本化 ...');
				updateVersion(sshConfig, env, successCallback);
			});
			return;
		}
		var item = queue.shift();
		var localPath = item[0];
		var remotePath = item[1];
		console.log('[FTP] 上传文件: ' + localPath + ' -> ' + remotePath);
		mkdir(Path.dirname(remotePath), function() {
			ftp.put(localPath, remotePath, function(hadError) {
				if (hadError) {
					console.error('[FTP] ' + hadError);
					return;
				}
				upload();
			});
		});
	}

	upload();
}

// 选择目录保存文件
function saveFile(fileName, content) {
    dialog.showSaveDialog(remote.getCurrentWindow(), {
        title: '文件保存到',
        defaultPath: (appConfig.saveas_path || homePath) + Path.sep + zipFileName,
        filters: [{ name: 'Zip文件', extensions: ['zip'] }]
    }, function(path){
        if (path) {
			writeFile(path, content);
            appConfig.saveas_path = Path.dirname(path);
            saveAppConfig();
			console.info('文件保存成功: ' + path);
        }
    });
}

// 生成zip文件
function saveZipFile(paths, fileUrlList, successCallback) {
	Rimraf.sync(zipFilesPath);
	Rimraf.sync(zipFilePath);

	console.info('开始生成ZIP文件 ...');

    var copyCount = 0;

	paths.forEach(function(path) {
		var relativePath = Path.relative(filesPath, path);
		var to = Path.join(zipFilesPath, relativePath);
        optimizeImg(path, to, function(copy){
            if (copy) {
                copyFile(path, to);
            }
            copyCount++;
            if (copyCount == paths.length) {
                createZip();
            }
        });
	});

    function createZip() {
    	var output = FS.createWriteStream(zipFilePath);
    	var archive = Archiver('zip');
    	output.on('close', function() {
    		console.log('ZIP文件列表:');
    		fileUrlList.forEach(function(fileUrl) {
    			console.log(fileUrl);
    		});
    		console.info('ZIP文件生成成功');
            successCallback && successCallback();
    		saveFile(zipFileName, readFile(zipFilePath));
    	});
    	archive.on('error', function(err) {
    		console.error('[ZIP] ' + err);
    	});
    	archive.pipe(output);

    	archive.bulk([
    		{
    			expand : true,
    			cwd : zipFilesPath,
    			src : ['**/*']
    		}
    	]);

    	archive.finalize();
    }
}

// 获取项目服务器信息
function getServerInfo() {
    var serverMap = {};
    appConfig.repo_data.forEach(function(item){
        try {
            var tpmConfig = require(item.local + Path.sep + 'tpm-config.js');
            var server = tpmConfig.server;
            for (var env in server) {
                for (var project in server[env]) {
                    serverMap[project] = serverMap[project] || {};
                    serverMap[project][env] = server[env][project];
                }
            }
        } catch(e) {
            console.error('读取tpm-config失败');
            return false;
        }
    });
    return serverMap;
}


module.exports = {
    config: getConfig,
    saveConfig: saveAppConfig,
    getRecentData: getRecentData,
    saveRecentData: saveRecentData,

    dataPath: dataPath,
    filesPath: filesPath,
	zipFilePath: zipFilePath,
    setRepoPath: setRepoPath,
    getRepoPath: getRepoPath,
    getCloneFolder: getCloneFolder,

    checkGit: checkGit,
    checkRemote: checkRemote,
    getBranch: getBranch,
    pullRemote: pullRemote,
    extractFiles: extractFiles,
    getTargetFiles: getTargetFiles,
    updateVersion: updateVersion,
    uploadByFtp: uploadByFtp,
    saveZipFile: saveZipFile,

    getUserInfo: getUserInfo,
    setUserInfo: setUserInfo,
    checkUserInfo: checkUserInfo,

    setProject: setProject,
    getProject: getProject,
    removeProject: removeProject,

    getRepoInfo: getRepoInfo,
    addRepoInfo: addRepoInfo,
    removeRepoInfo: removeRepoInfo,
    checkRepoInfo: checkRepoInfo,
    getServerInfo: getServerInfo
};
