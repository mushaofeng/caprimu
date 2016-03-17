var Http = require('http');
var Path = require('path');
var Fs = require('fs');
var Event = require('events').EventEmitter;
var Iconv = require('../../node_modules/hrt/node_modules/iconv-lite');
var zlib = require('zlib');
var Url = require('url');
var Mime = require('../../node_modules/hrt/node_modules/mime');
var Request = require('../../node_modules/hrt/node_modules/request');
var BufferHelper = require('./buffer-helper');
var IP = require('./ip');
// var chokidar = require('chokidar');

var HttpProxy = require('../../node_modules/hrt/node_modules/http-proxy');
var Util = require('../../node_modules/hrt/util.js');

var CONFIG_FILE, CONFIG, PORT, SILENT, DEBUG, WEINRE;

function loadMap(repo){
	var map = [];
	repo.forEach(function(data){
		try {
			var config = require(data.local + Path.sep + 'hrt-config.js');
			map = map.concat(config.map);
		} catch (e) {
			console.error(e.message);
		}
	});
	return map;
}

function before(url){
	var Tudou = this.util.loadPlugin('tudou');
	url = Tudou.stripVersionInfo(url);
	url = Tudou.cssToLess(url);
	return url;
}

function merge(path, callback) {
	var Tudou = this.util.loadPlugin('tudou');
	Tudou.merge.call(this, path, SILENT, callback);
}

function setResponse(response, contentType, buffer) {
	response.setHeader('Content-Type', contentType);
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.write(buffer);
	response.end();
}

function HRT(options){
	this.event = new Event();
	this.isAlive = false;
	this.update(options);
	this.init();
}

HRT.prototype.init = function(){

	var event = this.event;

	// reload config
    /*
	this.watcher = chokidar.watch(CONFIG_FILE, { ignored: /^\./, persistent: true });
	this.watcher.on('change', function(path){
		delete require.cache[CONFIG_FILE];
		CONFIG = require(CONFIG_FILE);
		Util.info('[watch] reload config: ' + CONFIG_FILE);
	});
    */

	// start server
	this.server = Http.createServer(function(request, response) {

		var url = request.url;
		var map = CONFIG.map;
		var accept = request.headers && request.headers.accept || '';

		var me = {
			config : CONFIG,
			util : Util,
			req : request,
			res : response,
		}

		if (!SILENT && DEBUG) {
			console.log('[get] ' + url);
		}

		var from = url;

		if (before) {
			from = before.call(me, from);
		}

		if (from) {
			var serverRoot = /^https?:\/\//.test(url) ? '' : CONFIG.serverRoot;

			var to = Util.rewrite(map, from, serverRoot);

			// rewrite
			if (from !== to){

				event.emit('rewrite', url, to);

				if (!SILENT) {
					Util.info('[rewrite] ' + url + ' -> ' + to);
				}

				// local file
				if (!/^https?:\/\//.test(to)) {
					if (merge) {
						merge.call(me, to, function(contentType, buffer, encoding) {
							if (typeof buffer == 'string' && encoding) {
								buffer = Iconv.toEncoding(buffer, encoding);
							}
							setResponse(response, contentType, buffer);
						});
						return;
					}

					var contentType = Mime.lookup(to);
					var buffer = Util.readFileSync(to);

					setResponse(response, contentType, buffer);
					return;
				}

				// remote URL
				request.pipe(Request(to)).pipe(response);
				return;
			}
		}

		// no rewrite
		var parsed = Url.parse(url);

		// weinre嵌入脚本
		if (WEINRE && accept.indexOf('text/html') > -1) {
			var req = Http.request({
				hostname: parsed.hostname,
				port: parsed.port || 80,
				path: parsed.path,
				headers: request.headers
			}, function(res){
				var bufferHelper = new BufferHelper();
				res.on('data', function(buffer) {
					bufferHelper.concat(buffer);
				}).on('end', function(){
					body = bufferHelper.toBuffer();
					body = zlib.gunzipSync(body).toString();
					body = body.replace(/<\/head>/, '<script src="http://' + IP.address() + ':9001/target/target-script-min.js#anonymous"></script></head>');
					body = zlib.gzipSync(body);
					res.headers['content-length'] = body.length;
					res.headers['content-encoding'] = 'gzip';
					response.writeHead(res.statusCode, res.headers);
					response.write(body);
					response.end();
				});
			});
			req.end();
			return;
		}

		var proxy = new HttpProxy.createProxyServer({
			target : {
				host : parsed.hostname,
				port : parsed.port || 80,
			},
		});

		proxy.proxyRequest(request, response);

	});

};

HRT.prototype.update = function(options){
	options || (options = {});
	CONFIG = {};
	CONFIG.serverRoot = options.serverRoot || '';
	CONFIG.map = loadMap(options.repo);
	WEINRE = options.weinre || false;
	SILENT = options.silent || false;
	DEBUG = options.debug || false;
	PORT = options.port || 7777;
};

HRT.prototype.start = function(port){
	this.server.listen(port || PORT);
	this.isAlive = true;
	Util.info('开启代理服务 端口: ' + port || PORT);
};

HRT.prototype.close = function(){
	this.server.close();
	this.isAlive = false;
	Util.error('关闭代理服务 ...');
};

HRT.prototype.silent = function(silent_mode){
	if (silent_mode == undefined) {
		return SILENT;
	} else {
		return SILENT = !!silent_mode;
	}
};

HRT.prototype.debug = function(debug_mode){
	if (debug_mode == undefined) {
		return DEBUG;
	} else {
		return DEBUG = !!debug_mode;
	}
};

module.exports = HRT;
