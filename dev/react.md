title: react
author:
  name: 牟少峰
  url: https://github.com/mushaofeng/angularJs/blob/master/react.md
output: react.html
theme: sudodoki/reveal-cleaver-theme

--
## Learn Once, Write Anywhere


--

##概念
### 状态机
[getInitialState方法用于定义初始状态](http://msf.tudou.com/react/react-demos/demo07/)
* this.setState({liked: !this.state.liked})
* this.state.liked
### props与state 的区别

* this.props 和 this.state 都用于描述组件的特性，可能会产生混淆。
  this.props 表示那些一旦定义，就不再改变的特性，而 this.state 是会随着用户互动而产生变化的特性。

--
##React Canvas

是Flipboard出品的一套前端框架，所有的界面元素都通过Canvas来绘制，infoQ之前也有文章对其进行了介绍。Flipboard追求极致的性能和用户体验，因此对浏览器的缓慢DOM操作深恶痛绝，不惜大刀阔斧彻底舍弃了DOM，而完全用Canvas实现了整套UI控件。

--
## ref

###组件的生命周期

* 组件的生命周期分成三个状态：

	1. Mounting：已插入真实 DOM
	2. Updating：正在被重新渲染
	3. Unmounting：已移出真实 DOM


--
##Flux
Flux是一个系统架构，用于推进应用中的数据单向流动。
Flux 是一个Facebook开发的、利用单向数据流实现的应用架构，用于 React。Flux应用有三个主要的部分组成：调度程序、存储和视图（React 组件）.
以某种方式使代码结构化，使其更加可预测.	

React是一个JavaScript框架，用于构建“可预期的”和“声明式的”Web用户界面，它已经使Facebook更快地开发Web应用。

示例目录：~/git/react/flux-starter-kit
启动命令：npm start 

[Flux 一个数据流周期](src/img/flux/flux.png)
[Flux 应用示例](http://localhost:8000)
[Flux 目录结构划分](http://react.nodejs-china.org/t/fluxde-mu-lu-jie-gou-gai-heng-xiang-hua-fen-huan-shi-zong-xiang-hua-fen-ni/938)
[Flux 目录结构划分](src/img/flux/Directory_Structure.png)
--

##参考

[React 入门实例教程](http://www.ruanyifeng.com/blog/2015/03/react.html)
[React tutorial](http://facebook.github.io/react/docs/tutorial.html)
[react-components](http://react-components.com/)
[react-demos](https://github.com/ruanyf/react-demos)
[Examples](https://github.com/facebook/react/wiki/Examples)
[TodoMVC](http://facebook.github.io/flux/docs/todo-list.html)

[flux  入门](http://www.oschina.net/question/1397765_236546)
参考资料

React官方网站：http://facebook.github.io/react/
React博客：http://facebook.github.io/react/blog/
React入门：http://ryanclark.me/getting-started-with-react/
颠覆式前端UI框架：React：http://www.infoq.com/cn/articles/subversion-front-end-ui-development-framework-react
Immutable.js: http://facebook.github.io/immutable-js/
React Native: http://facebook.github.io/react-native/
Flux: https://facebook.github.io/flux/
Flux框架对比：https://github.com/voronianski/flux-comparison
React开发者大会网站：http://conf.reactjs.com/index.html
React在Slack上的聊天社区：http://reactiflux.com/


[React Native 基础练习](http://segmentfault.com/a/1190000002645929)