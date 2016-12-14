



(function(global, func) {
    typeof define === "function" && (define.amd || define.cmd) ? define(function() {
        return func(global);
    }) : func(global, true);
})(this, function(global, lazy) {});


[requireJs](http://www.myexception.cn/javascript/1893484.html)