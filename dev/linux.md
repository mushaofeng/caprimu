#LINUX
##常用命令
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
* chmod命令
	`chmod +x  git.sh`   `./git.sh`	
* weget 