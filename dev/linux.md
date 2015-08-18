#LINUX
##常用命令
npm升级
 sudo npm -g install npm@2.9.1
* grep命令

	`grep [-acinv] [--color=auto] '查找字符串' filename `  `ls -l | grep -i file `
	```
	-a ：将binary文件以text文件的方式查找数据 
	```
* 文本搜索命令
	`find . -type f -print | xargs grep "wind"`

* find命令	
	`find [PATH] [option] [action] `   `find /root -mtime 0 # 在当前目录下查找今天之内有改动的文件  `
	`find . -name "*.c"`
* 删除某一目录下的某一文件
	`find  . -name '.DS_Store' | xargs rm -rf `
* chmod命令
	`chmod +x  git.sh`   `./git.sh`
* alias
	subl ./.zshrc   
* mkdir 
	mkdir -p Project/a/src	
	mkcd Project/a/src
	mkdir -p Project/{a,b,c,d}/src
* weget 

tar zxvf webbench-1.5.tar.gz

## CentOS
*  包管理工具(yum)
rpm -q centos-release
[nodejs安装](http://blog.csdn.net/simplty/article/details/38434247)