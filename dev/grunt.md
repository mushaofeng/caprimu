#[grunt](http://www.gruntjs.org/)


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
##安装

* 安装grunt CLI  `npm install -g grunt-cli`
* 项目目录增加配置文件 `package.json` 和 `Gruntfile.js`
	Gruntfile.js:注意G的大写，这个文件就是grunt的配置了，其中详细定义了每个任务的细节和执行任务的顺序等。
* 安装grunt `npm install grunt --save-dev`
	[结果](/img/grunt.png)
* 配置任务Gruntfile.js 
	```
	module.exports = function(grunt) {
	  grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json');
	  });
	};
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