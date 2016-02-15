#[grunt](http://www.gruntjs.org/)



##配置

* 安装grunt CLI  `npm install -g grunt-cli`
* 项目目录增加配置文件 `package.json` 和 `Gruntfile.js`
	Gruntfile.js:注意G的大写，这个文件就是grunt的配置了，其中详细定义了每个任务的细节和执行任务的顺序等。
* 安装grunt `npm install grunt --save-dev`
	[结果](/img/grunt.png)
* 配置任务Gruntfile.js 
	1. Gruntfile.js通用的写法
	```
	module.exports = function(grunt) {
	  grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json');
	  });
	};
	```

	2. 加载grunt需要的插件

	`grunt.loadNpmTasks('grunt-cmd-transport')`

	3. 告诉grunt该怎么执行这些任务

	`grunt.registerTask('build', ['transport', 'concat']);`

* 执行命令

	`grunt build`	

##不同系统下换行符的处理
	grunt.util.normalizelf(options.separator)

##关键词
[任务插件](http://gruntjs.com/plugins)`transport`  目标`dialog`

	```
	transport: {
	    dialog: {
	        files : [
	            {
	                src : '*',
	                dest : '.build/styles/component/dialog/src'
	            }
	        ]
	    }
	}
	```

##Demo
```
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        transport: {
            dialog: {
                files : [
                    {
                        src : '*',
                        dest : '.build/styles/component/dialog/src'
                    }
                ]
            }
        },
        concat: {
            dialog: {
                files: {
                    "dist/styles/component/dialog/src/dialog.js": [".build/styles/component/dialog/src/dialog.js"]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');

    grunt.registerTask('build', ['transport', 'concat']);
};
```
##相关资料
*[关于Grunt，从一个简单的配置开始！](http://docs.spmjs.org/contrib/simple-grunt)
*[常用任务插件](https://github.com/gruntjs/grunt-contrib) [插件列表](http://www.xuanfengge.com/grunt-commonly-used-plug-in-introduced.html)