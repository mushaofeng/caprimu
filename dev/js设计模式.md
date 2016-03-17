##proxy
代理模式的定义是把对一个对象的访问, 交给另一个代理对象来操作.
##curry

##桥接模式

桥接模式的作用在于将实现部分和抽象部分分离开来， 以便两者可以独立的变化
forEach = function( ary, fn ){
  for ( var i = 0, l = ary.length; i < l; i++ ){
    var c = ary[ i ];
    if ( fn.call( c, i, c ) === false ){
      return false;
    }
   }
}

##外观模式
外观模式提供一个高层接口，这个接口使得客户端或子系统更加方便调用。
var getName = function(){
  return 'svenzeng‘
}
var getSex = function(){
   return 'man'
}
var getUserInfo = function(){
  var info = a() + b();
  return info;
}
##Iterator

迭代器模式提供一种方法顺序访问一个聚合对象中各个元素，而又不需要暴露该方法中的内部表示。

##promise

##单例

var singleton = function( fn ){
    var result;
    return function(){
        return result || ( result = fn .apply( this, arguments ) );
    }
}

var createMask = function(){
  var mask;
  return function(){
       return mask || ( mask = document.body.appendChild( document.createElement('div') ) )
  }
}()

##发布订阅(观察者模式)
[发布订阅](http://www.yinfan.org/article/subscribe-publish-model)

##适配器模式

$id = function( id ){
 
  return jQuery( '#' + id )[0];
 
}

##策略模式
策略模式的意义是定义一系列的算法，把它们一个个封装起来，并且使它们可相互替换。
$( div ).animate( {"left: 200px"}, 1000, 'linear' );  
$( div ).animate( {"left: 200px"}, 1000, 'cubic' );  

表单验证

##事件监听

##中介者模式




##异步

回调函数
事件监听
发布/订阅
Promise 对象

Iterator（遍历器）

##函数
1.函数重写
var alert1= alert;
alert= function(str){
	console.log( str );
	alert=alert1
	alert(str)
}

[常用的Javascript设计模式](http://blog.jobbole.com/29454/)