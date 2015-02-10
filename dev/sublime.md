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
##常用插件

###[EMMET插件自定义模块](/dev/src/snippets.json)
```html
"csscaret":"position: absolute;\ntop: 14px;\nleft: 20px;\nborder-style: dashed dashed solid;\nborder-color: transparent transparent #f00;\nborder-width: 14px 15px;\nheight: 0;\nwidth: 0;\nfont-size: 0;",
"cssci":"color: #ff6600;",
"csspa":"position: absolute;\t\nleft: |;\t\ntop:;",
"csslips":"\twidth: px;\n\toverflow: hidden;\n\twhite-space: nowrap;\n\ttext-overflow: ellipsis;",
"cssfilter":"\tfilter:alpha(opacity=50);\n\topacity:0.5;",
"cssbg":"position: absolute;\nleft: 0;\ntop: 0;\nwidth: 100%;\nheight: 100%;\nfilter:alpha(opacity=30);\nopacity:0.3;\nbackground: #000;",
"cssbtn":"\ndisplay: inline-block;\nwidth: 70px;\nheight: px;\nline-height: px;\nborder-radius: px;\nbackground: ;\ncolor: #FFF;\ntext-decoration: none;"
```