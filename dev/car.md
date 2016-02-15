#框架

##wordpress 插件 
1.Timber

##模板 
1. twig templates


##
npm install
brew
bower
gulp watch

##node

[Node.js + Express + MongoDB教程](http://www.jdon.com/idea/nodejs/node-express-mongo.html)
[nodejs 异步回调嵌套](http://blog.fens.me/nodejs-async/)
[异步回调嵌套 EventProxy](http://kb.cnblogs.com/page/121539/)
[后台开启node 服务\nodejs 多进程](https://cnodejs.org/topic/5021c2cff767cc9a51e684e3)
[mongo学习文档](https://cnodejs.org/topic/504b4924e2b84515770103dd)

##mongo 版本
/usr/local/etc/mongod.conf

""

## 

[Mac OSX 10.9.4下使用Homebrew安装MongoDB](http://www.inferjay.com/blog/2014/07/18/use-homebrew-install-mongodb-at-the-mac-osx-10.9.4/)
[ubuntu 下装MongoDB](http://docs.mongodb.org/master/tutorial/install-mongodb-on-ubuntu/?_ga=1.142864053.106317460.1438321587)



启动	nohup node app.js
关闭  ps -ef | grep node
			kill -9 pid
##问题mongodb
关联表的用法
	getCategoryCars:function  (id,cb) {
		return this.findOne({_id: id}).populate('cars').exec(cb)
	},
排序
["55c41a6424688785c30302f0","55c2ae10c3da4ee3be485115","55c41bcc24688785c30302f8","55c41c1f24688785c30302f9","55c72dbc9b7140c40bb34497","55c7308cc677e50c0f487734"]
db.movies.update({id:1},{$set:{name:111}})

