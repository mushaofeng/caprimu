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
	find . -mtime -1  //一个内修改的文件   +1 一天前修改的文件   1 昨天修改的文件

* grep 在文件 中查找文本
* 打包、压缩
	tar -cvf //打包
	-xvf  //解压
	tar -jcvf *.tar.bz2 //压缩
	tar -zcvf *.tar.gz  //压缩

* 删除某一目录下的某一文件

-a  //or
find /ect -size +20K  -a -size -50K

-exec ls -al {}\ 
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


* tail -f /var/ect/err.log  // 实时监听插入文件 的数据 
tar zxvf webbench-1.5.tar.gz

## CentOS
*  包管理工具(yum)
rpm -q centos-release
[nodejs安装](http://blog.csdn.net/simplty/article/details/38434247)