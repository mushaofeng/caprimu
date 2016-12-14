
#react-native 入门开发

##代码

1 react-native 引用 常用组件及API


##环境
* Mac OS  10.11
* Xcode >7.3
* brew -0.9.9
* node v6.4.0
* npm -3.10.3
* react-native-cli
* Android Studio2.0(配置环境变量)
* Watchman

##技术栈

* ES6 语法
  解构、扩展运算符、箭头函数
* React
  props state
* Flex 布局
* npm


##运行调试

react-native init hellow --verbose

react-native run-ios

 ./gradlew clean 

 rnpm link

pod install

adb install -r android/app/build/outputs/apk/app-debug.apk 

$ sudo lsof -n -i4TCP:8081 | grep LISTEN

$ kill -9 <PID>

##
1.数据问题

##问题
1.环境问题 
2.第三方插件、模块 不稳定
3.虚拟机无法呼起
4.代码结构优化
5.Adroid 无法安装 手动安装
adb install -r android/app/build/outputs/apk/app-debug.apk 

[文档](https://facebook.github.io/react-native/docs/getting-started.html)
[Troubleshooting](https://facebook.github.io/react-native/docs/troubleshooting.html)
[node升级](http://blog.csdn.net/sruru/article/details/46301405)
[xcode7.3](http://adcdownload.apple.com/Developer_Tools/Xcode_7.3/Xcode_7.3.dmg
)
[React Native Height and Width (尺寸)，Flexbox(位置关系)](http://www.tuicool.com/articles/IFbeyuZ)
[sublime插件](http://blog.csdn.net/kaka_2928/article/details/51382303)
[React-Native组件](http://vczero.github.io/react_native/%E7%AC%AC3%E7%AF%87css%E5%92%8C%E5%B8%83%E5%B1%80.html)

[React-Native With Redux](http://www.tuicool.com/articles/7FZreu2)
[如何通俗易懂的理解 Redux](https://www.zhihu.com/question/41312576)

Valid style props: [
  ["alignItems",](http://caibaojian.com/demo/flexbox/align-items.html)
  "alignSelf",
  "backfaceVisibility",
  "backgroundColor",
  "borderBottomColor",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "borderBottomWidth",
  "borderColor",
  "borderLeftColor",
  "borderLeftWidth",
  "borderRadius",
  "borderRightColor",
  "borderRightWidth",
  "borderStyle",
  "borderTopColor",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderTopWidth",
  "borderWidth",
  "bottom",
  "color",
  "elevation",
  "flex",
  "flexDirection",
  "flexWrap",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontWeight",
  "height",
  "justifyContent",
  "left",
  "letterSpacing",
  "lineHeight",
  "margin",
  "marginBottom",
  "marginHorizontal",
  "marginLeft",
  "marginRight",
  "marginTop",
  "marginVertical",
  "maxHeight",
  "maxWidth",
  "minHeight",
  "minWidth",
  "opacity",
  "overflow",
  "padding",
  "paddingBottom",
  "paddingHorizontal",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "paddingVertical",
  "position",
  "resizeMode",
  "right",
  "rotation",
  "scaleX",
  "scaleY",
  "shadowColor",
  "shadowOffset",
  "shadowOpacity",
  "shadowRadius",
  "textAlign",
  "textDecorationColor",
  "textDecorationLine",
  "textDecorationStyle",
  "tintColor",
  "top",
  "transform",
  "transformMatrix",
  "translateX",
  "translateY",
  "width",
  "writingDirection"
  ]