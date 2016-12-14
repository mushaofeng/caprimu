title: react-native 入门
author:
  name: caprimu
output: react-native.html
theme: sudodoki/reveal-cleaver-theme
--
#react-native 入门

--

*  环境
*  技术栈
*  开发常用命令
*  代码分析
*  问题

--

##开发环境 
* Mac OS  10.11
* Xcode >7.3
* brew -0.9.9
* node v6.4.0
* npm -3.10.3
* react-native-cli
* Android Studio2.0(配置环境变量)
* Watchman


--

##技术栈

* ES6 语法
  解构、扩展运算符、箭头函数
* React
  props state
* Flex 布局
* npm
* redux

--

##常用命令

* react-native init hellow --verbose
* react-native run-ios(run-android)
* ./gradlew clean 
* adb install -r android/app/build/outputs/apk/app-debug.apk
* sudo lsof -n -i4TCP:8081 | grep LISTEN
* kill -9 <PID>
* sudo chown -R `whoami` /usr/local
* rnpm link

-- 

##代码分析

* 目录结构
* 代码结构 
* 样式与布局
* 第三方模块引用 
* ES6

--

## 问题

* 环境问题 
* 第三方插件、模块 不稳定
* 模拟器无法呼起
* 代码结构优化
* Adroid 无法安装 手动安装

--

##参考文档

* [文档](https://facebook.github.io/react-native/docs/getting-started.html)
* [Troubleshooting](https://facebook.github.io/react-native/docs/troubleshooting.html)
* [node升级](http://blog.csdn.net/sruru/article/details/46301405)
* [xcode7.3](http://adcdownload.apple.com/Developer_Tools/Xcode_7.3/Xcode_7.3.dmg
)
* [React Native Height and Width (尺寸)，Flexbox(位置关系)](http://www.tuicool.com/articles/IFbeyuZ)
* [sublime插件](http://blog.csdn.net/kaka_2928/article/details/51382303)
* [React-Native组件](http://vczero.github.io/react_native/%E7%AC%AC3%E7%AF%87css%E5%92%8C%E5%B8%83%E5%B1%80.html)
* [React-Native With Redux](http://www.tuicool.com/articles/7FZreu2)
* [如何通俗易懂的理解 Redux](https://www.zhihu.com/question/41312576)
