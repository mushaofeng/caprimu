#Weex
Weex是跨平台，可扩展的动态化技术
##
Weex主要解决了频繁发版和多端研发两大痛点

##

[weex原理概述](https://esmeetu.gitbooks.io/weex/content/advanced/how-it-works.html)
[工作原理](https://github.com/weexteam/article/issues/65)

##概念

* [Weex Native渲染器](http://alibaba.github.io/weex/download.html)
* Transformer（转换器): 一个Node JS工具， 转换Weex源码为JS Bundle
* Weex JS Framework(JS框架): 运行于客户端的的JS框架，管理着Weex实例的运行。Weex实例由JS Bundle创建并构建起虚拟DOM树. 另外，它发送/接受 Native 渲染层产生的系统调用，从而间接的响应用户交互。
* Native引擎: 在不同的端上，有着不同的实现: iOS/Android/HTML5. 他们有着共同的组件设计, 模块API 和渲染效果. 所以他们能配合同样的 JS Framework 和 JS Bundle工作。

##环境
cnpm install -g weex-toolkit
cnpm install weex-devtool -g

##工具

##开发

###模板

[组件嵌套](https://github.com/weexteam/article/issues/2)
[组件间如何通信](https://github.com/weexteam/article/issues/2)

###样式

* Weex 遵循 HTML 属性 命名规范 , 所以属性命名时请不要使用陀峰格式(CamelCase) , 采用以“-”分割的long-name形式。
* 为了简化页面设计和实现, 屏幕的宽度统一为750像素, 不同屏幕会按照比例转化为这一尺寸。
* 标准CSS支持很多样式选择器, 但Weex目前只支持单个类的选择器。
* 标准CSS支持很多的长度单位,Weex目前只支持像素,并且px在样式中可以忽略不写, 直接使用对应的数值.更多详情请查看 通用样式.
* 子元素的样式不会继承自父元素, 这一点与标准CSS不同, 比如color和font-size等属性.
* 标准CSS包含了非常多的样式属性, 但Weex只支持了其中的一部分, 包括盒模型,flexbox,position等布局属性. 以及font-size, color等样式.



###script

<script>中的代码遵循 JavaScript(ES5)语法

###Lifecycle options
  init: function () {
    console.log('ViewModel constructor begins')
  },
  created: function () {
    console.log('Data observation finished')
  },
  ready: function () {
    console.log('Virtual DOM finished')
  },


###数据

* 数据绑定
[数据绑定](https://esmeetu.gitbooks.io/weex/content/syntax/data-binding.html)
我们在数组的原型上提供了一个额外的方法：$set(index, item)。

* 元素查询
this.$el(id)

var dom = require('@weex-module/dom')
var top = this.$el('top')
dom.scrollToElement(top) 



###前端依赖

* require('xxx.js') : 依赖一个JS文件
* require('npm-module-name') : 依赖一个NPM模块
* require('xxx.we') : 包含一个we文件来注册一个Weex自定义组件
* require('@weex-module/xxx') : 以来一个Weex原生模块。

###事件
* [组件通信](https://esmeetu.gitbooks.io/weex/content/syntax/comm.html)
* [Vuex](https://github.com/weexteam/article/issues/62)
* [event](https://esmeetu.gitbooks.io/weex/content/references/component-defs.html)

###module.exports
* data
* methods
* ready
* computed

###[自定义原生组件](https://esmeetu.gitbooks.io/weex/content/how-to/customize-a-native-component.html)

##[调试](https://yq.aliyun.com/articles/57651)




##构建


##问题
Weex支持哪些样式属性
组件封装文件引用路径
内部封装组件有哪些
weex数据模式
@weex-module


##

* Weex将整个app的宽度定死在750px，然后其他都是根据scale进行计算的，会导致适配不方便。
* weex七月底全部开源完成。开源时间较晚。
* github目前有6k+ start，主要贡献人员以阿里为主，额外贡献人较少。
* issue和pull request也比较少，社区目前规模比较小。
* 文档更新较慢，
* 很多组件和模块需要自己扩展（比如datepicker，iconfont，摄像头，二维码,热更新的方案等）



##资料
[中文文档](https://esmeetu.gitbooks.io/weex/content/)
[常见问题](https://github.com/weexteam/article/issues/66)
[Weex框架Android](http://smilevenus.com/2016/07/03/%E9%98%BF%E9%87%8CWeex%E6%A1%86%E6%9E%B6Android%E5%B9%B3%E5%8F%B0%E5%88%9D%E4%BD%93%E9%AA%8C/)
https://github.com/weexteam/article/issues
Weex快速上手指南：https://github.com/weexteam/article/issues/4

Weex SDK集成指南：https://open.taobao.com/doc2/detail?&docType=1&articleId=104742

750px问题讨论：https://github.com/alibaba/weex/issues/421

本地图片加载问题讨论：https://github.com/alibaba/weex/issues/419

本地文件路径讨论：https://github.com/alibaba/weex/issues/497

