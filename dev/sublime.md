#sublime 
##常用快捷键
* 选中当前的标签内容　　`cmd+shift+A`
* 复制历史　`ctr+alt+cmd+V`
* 纵向选择  `alt+选区`
* 跳转至对应的括号  `ctr+^+M`
* 格式化HTML  `ctr＋alt＋f`
* 选择词 `cmd + D`
* 粘贴并自动缩进 `cmd + shift + V`
* 拆分窗口  `cmd + alt + 2(3...)`

##自定义快捷方式
```
[
	{ "keys": ["super+,"], "command": "context_menu" },
	{ "keys": ["super+b"], "command": "svn_wc_commit" },
	{ "keys": ["super+u"], "command": "svn_wc_update" },
	{ "keys": ["super+alt+p"], "command": "svn_command_filter", "args": {"force_folder": true}  },
	{ "keys": ["super+alt+l"], "command": "svn_wc_log" },
	{ "keys": ["super+shift+l"], "command": "svn_log" },
	{ "keys": ["super+alt+}"], "command": "svn_merge" },
	{ "keys": ["super+6"], "command": "insert_snippet", "args": {"name": "Packages/User/filter.sublime-snippet"} },
	{ "keys": ["super+2"], "command": "insert_snippet", "args": {"name": "Packages/User/tpl.sublime-snippet"} },
	{ "keys": ["super+3"], "command": "insert_snippet", "args": {"name": "Packages/User/console.sublime-snippet"} },
	{ "keys": ["super+4"], "command": "insert_snippet", "args": {"name": "Packages/User/select.sublime-snippet"} },
	{ "keys": ["super+5"], "command": "insert_snippet", "args": {"name": "Packages/User/svn_msf.sublime-snippet"} },
	{ "keys": ["super+6"], "command": "insert_snippet", "args": {"name": "Packages/User/require_init.sublime-snippet"} },	
	{ "keys": ["ctrl+shift+]"], "command": "compact_expand_css", "args": { "action": "expand" }  },
	{ "keys": ["ctrl+alt+f"], "command": "tag_indent" },
	{ "keys": ["ctrl+shift+["], "command": "compact_expand_css", "args": { "action": "compact" } }		
]
```

##To solve sublime Text IPv6
设置host 50.116.34.243 sublime.wbond.net

##常见问题
[中文乱码](http://www.fuzhaopeng.com/2012/sublime-text-2-with-gb2312-gbk-support/)
[sublime3 无法使用Package Control或插件安装失败的解决方法](http://blog.csdn.net/freshlover/article/details/44261229)
#To solve sublime Text IPv6
设置host 50.116.34.243 sublime.wbond.net
##常用插件

###GBK Encoding Support

###[EMMET](http://docs.emmet.io/)

####[EMMET插件自定义模块](/dev/src/snippets.json)
```CSS
"csscaret":"position: absolute;\ntop: 14px;\nleft: 20px;\nborder-style: dashed dashed solid;\nborder-color: transparent transparent #f00;\nborder-width: 14px 15px;\nheight: 0;\nwidth: 0;\nfont-size: 0;",
"cssci":"color: #ff6600;",
"csspa":"position: absolute;\t\nleft: |;\t\ntop:;",
"csslips":"\twidth: px;\n\toverflow: hidden;\n\twhite-space: nowrap;\n\ttext-overflow: ellipsis;",
"cssfilter":"\tfilter:alpha(opacity=50);\n\topacity:0.5;",
"cssbg":"position: absolute;\nleft: 0;\ntop: 0;\nwidth: 100%;\nheight: 100%;\nfilter:alpha(opacity=30);\nopacity:0.3;\nbackground: #000;",
"cssbtn":"\ndisplay: inline-block;\nwidth: 70px;\nheight: px;\nline-height: px;\nborder-radius: px;\nbackground: ;\ncolor: #FFF;\ntext-decoration: none;"
```
#### 常用模板
```
"pos:s": "position:static;",
"pos:a": "position:absolute;",
"pos:r": "position:relative;",
"fl:l": "float:left;",
"fl:r": "float:right;",
"d:n": "display:none;",
"d:b": "display:block;",
"d:f": "display:flex;",
"d:i": "display:inline;",
"d:ib": "display:inline-block;",
"ov:h": "overflow:hidden;",
"bd+": "border:${1:1px} ${2:solid} ${3:#000};",
"bdr+": "border-right:${1:1px} ${2:solid} ${3:#000};",
"bg+": "background:${1:#fff} url(${2}) ${3:0} ${4:0} ${5:no-repeat};",
"bg:ie": "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='${1:x}.png',sizingMethod='${2:crop}');",
"bgc": "background-color:#${1:fff};”,
"op+": "opacity: $1;\nfilter: alpha(opacity=$2);",
```
`st` `sc`

##
[如何优雅地使用Sublime Text3](http://www.jianshu.com/p/3cb5c6f2421c)


##license
--sublime 3 license--
—– BEGIN LICENSE —–
Andrew Weber
Single User License
EA7E-855605
813A03DD 5E4AD9E6 6C0EEB94 BC99798F
942194A6 02396E98 E62C9979 4BB979FE
91424C9D A45400BF F6747D88 2FB88078
90F5CC94 1CDC92DC 8457107A F151657B
1D22E383 A997F016 42397640 33F41CFC
E1D0AE85 A0BBD039 0E9C8D55 E1B89D5D
5CDB7036 E56DE1C0 EFCC0840 650CD3A6
B98FC99C 8FAC73EE D2B95564 DF450523
—— END LICENSE ——

