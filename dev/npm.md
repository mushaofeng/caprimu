#npm 常用操作

##安装
[linux](http://www.imooc.com/video/6692)

## 常用命令
1.npm -v
2. sudo npm install -g --unsafe-perm yo
3. npm root -g   /查看模块安装位置
npm install grunt --registry=http://registry.npm.taobao.org


安装本地/全局依赖包， npm install <package-name>  /  npm install -g <package-name> （这样会下载安装最新的包，若下载安装特定版本号的包则 npm install <package-name>@<version> ）

卸载本地/全局依赖包， npm uninstall <package-name> / npm uninstall -g <package-name> 

更新本地/全局依赖包， npm update <package-name> / npm update -g <package-name> 




[常用命令](http://www.cnblogs.com/fsjohnhuang/p/4178019.html) 


##module目录

1./usr/local/lib/node_modules  ||  /Users/msf/node_modules/



##
nodejs.org
npmjs.com
[node.js中文资料导航](https://github.com/youyudehexie/node123)


##翻墙问题解决
国内访问NPM服务过慢的原因，推荐使用CNPM提供的服务做代理。

# 在 ~/.bashrc 或者 ~/.zshrc 中加入
alias cnpm='npm --registry=https://registry.npm.taobao.org'
source ~/.bash_profile

# 创建 ~/.bash_profile 文件以解决sudo cnpm时提示命令未定义问题
alias sudo='sudo '
上面非官方推荐的方式，因为官方的方式安排