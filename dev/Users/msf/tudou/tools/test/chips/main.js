var remote = require('remote');
var AppMenu = remote.require('menu');
var AppMenuItem = remote.require('menu-item');
var AppWindow = remote.require('browser-window');
var Path = require('path');
var React = require('react');
var mui = require('material-ui');
var weinre = require('weinre');
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;
var { AppCanvas, AppBar, TextField, List, ListItem, ListDivider, Toggle, Tabs, Tab, DropDownMenu, IconButton, FlatButton } = mui;
var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

window.jQuery = window.$ = require('./build/js/lib/jquery.js');
var chosen = require('./build/js/lib/chosen.jquery.js');

var vm = require('./build/js/vm.js');
var hrt = require('./build/js/hrt.js');
var util = require('./build/js/util.js');
var chips = require('./build/js/chips.js');
var { grepFiles } = require('./build/js/util.js');
var Menu = require('./build/js/component/menu.js');
var Console = require('./build/js/component/console.js');
var Tappable = require('./build/js/component/tappable.js');
var TplSetting = require('./build/js/component/tplSetting.js');
var UserSetting = require('./build/js/component/userSetting.js');
var RepoSetting = require('./build/js/component/repoSetting.js');
var CustomDialog = require('./build/js/component/customDialog.js');
var FileCheckList = require('./build/js/component/fileCheckList.js');

var CONFIG;

var styles = {
    side: {
        width: 210,
        height: '100%',
        background: '#f9f9f9',
        position: 'absolute',
        top: 0
    },
    main: {
        overflow: 'auto',
        position:'absolute',
        left: 210,
        bottom: 0,
        right: 0,
        top: 0
    },
    consoleFrame: {
        width: '100%',
        height: 250,
        borderTop: '1px solid #eee',
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0
    },
    repoMenu: {
        padding: '0 0 10px',
        background: '#f9f9f9',
        fontSize: 15
    },
    repoEmpty: {
        padding: 15,
        color: '#afafaf'
    },
    addRepoBtn: {
        position: 'absolute',
        top: 48,
        right: 0
    },
    label: {
        display: 'inline-block',
        verticalAlign: 'top',
        lineHeight: '60px',
        textIndent: '10px'
    },
    dropDown: {
        height: 45,
        marginRight: 10,
        lineHeight: '45px'
    },
    dropMenu: {
        width: '250px !important',
        maxHeight: 300
    },
    projectSelect: {
        minWidth: 500,
        margin: 20
    },
    listTextField: {
        width: 36,
        right: 18,
        top: 0
    },
    getFileListBtn: {
        position: 'absolute',
        right: 32,
        top: 32
    },
    tabContent: {
        padding: '20px 25px',
        overflow: 'auto'
    },
    tabTemplateStyle: {
        padding: 20,
        overflow: 'auto'
    },
    buttonLabelSize: {
        fontSize: 16
    },
    tabFontSize: {
        fontSize: 17
    }
};


var App = React.createClass({displayName: "App",

    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    getInitialState() {
        return {
            config: chips.config(),
            userInfo: chips.getUserInfo(),
            repoInfo: chips.getRepoInfo(),
            projectInfo: chips.getProject(),
            serverInfo: chips.getServerInfo(),
            tabContent: { height: this._getTabContentHeight() },
            branchMenuItems: [{ text: '请选择' }],
            serverMenuItems: [{ text: '请选择' }],
            branchMenuIndex: 0,
            serverMenuIndex: 0,
            publishDisable: true,
            weinreOnState: false,
            proxyOnState: false,
            projectFilter: '',
            fileList: []
        };
    },

    componentDidMount() {
        chips.checkGit(stdout => {
            // 首次设置用户信息
            if (!chips.checkUserInfo()) {
                this.refs.userSetting.show();
                return;
            }
            // 初始化主页面
            this._initPublishUI();

        }, stderr => {
            this.refs.dialog.alert('出错啦', '请先安装git命令行工具', (err) => {
                remote.getCurrentWindow().close();
            });
        });

		this.$projectItems = $('.project-items');
        this.$projectItems.chosen({ no_results_text: '未找到项目' });

        window.addEventListener('beforeunload', () => {
            this._saveRecent();
            if (this.weinreWindow) {
                this.weinreWindow.hide();
                this.weinreWindow = null;
            }
        });

        window.addEventListener('resize', () => {
            this.setState({ tabContent: { height: this._getTabContentHeight() } });
        });

        this._initPublishVM();
    },

    componentWillUnmount() {
        var body = document.body;
		var holder = document.getElementById('templateList');
		holder.ondrop = holder.ondragover = holder.ondragleave = holder.ondragend = null;
		body.ondrop = body.ondragover = body.ondragleave = body.ondragend = null;
	},

    renderVmList() {
        var html = [];
        var filter = this.state.projectFilter;
        var tm = +new Date;
        if (this._tm == undefined) {
            this._tm = -1;
        }
        var loadCache = (this._tm ? (tm - this._tm) : 0) < 5000;
        Object.keys(this.state.projectInfo).forEach((key, i) => {
            var item = [], list = [];
            this._cache = this._cache || {};
            var data = this.state.projectInfo[key];
            var files = loadCache && this._cache[key] || util.grepPaths(data.path);
            this._cache[key] = files;
            var server = this.state.serverInfo[key];
            if (!server) return;
            Object.keys(server).forEach((env, index) => {
                if (data.env == env) {
                    item.push(React.createElement("option", {selected: "selected", value: env}, env));
                } else {
                    item.push(React.createElement("option", null, env));
                }
            });
            files.forEach((file) => {
                var relFile = file.replace(data.path, '.');
                if (!filter || relFile.toLowerCase().indexOf(filter) > -1) {
                    list.push(
                        React.createElement("div", {className: "tpl-item", "data-path": file, onDoubleClick: this._openFile}, 
                            React.createElement("span", {className: "tpl-title", dangerouslySetInnerHTML: { __html: filter && relFile.replace(RegExp(filter, 'i'), $1 => '<em>' + $1 + '</em>') || relFile}}), 
                            React.createElement("span", {className: "tpl-action"}, 
                                React.createElement("select", null, item), 
                                React.createElement("a", {href: "#", onClick: this._publishAction, "data-project": key, "data-path": file}, "发布")
                            )
                        )
                    );
                }
            });
            if (list.length) {
                html.push(
                    React.createElement("div", {className: "tpl-group"}, 
                        React.createElement("div", {className: "tpl-group-head"}, 
                            React.createElement(Tappable, {onPress: this._removeTplPath}, 
                                React.createElement("h5", {"data-key": key}, key, " - ", data.path)
                            )
                        ), 
                        React.createElement("div", {className: "tpl-group-main"}, 
                        list
                        )
                    )
                );
            }
        });
        if (html.length == 0) {
            if (filter) {
                html.push(React.createElement("div", {className: "tpl-tips"}, "没有找到含有 ", filter, " 的模版"));
            } else {
                html.push(React.createElement("div", {className: "tpl-tips"}, "拖放项目模版所在目录到此处"));
            }
        }
        this._tm = tm;
        return (React.createElement("div", {className: "tpl-list"},  html ));
    },

    render() {
        var tabContentStyle = $.extend(styles.tabContent, this.state.tabContent);
        var tabTemplateStyle = $.extend(styles.tabTemplateStyle, this.state.tabContent);
        return (
            React.createElement(AppCanvas, null, 
                React.createElement(CustomDialog, {ref: "dialog"}), 
                React.createElement(FileCheckList, {ref: "filelist"}), 
                React.createElement(TplSetting, {ref: "tplSetting"}), 
                React.createElement(RepoSetting, {ref: "repoSetting", onSubmit: this._onSubmitRepo}), 
                React.createElement(UserSetting, {title: this.state.userInfo.username ? '修改JIRA账号信息' : '填写JIRA账号信息', ref: "userSetting", userInfo: this.state.userInfo, onSubmit: this._onSubmitUser}), 
                React.createElement("div", {style: styles.side}, 
                    React.createElement("div", {onClick: this._userSetting}, 
                        React.createElement(AppBar, {className: "appbar", title: this.state.userInfo.username || 'Tudou Dev', zDepth: 0, iconElementLeft: React.createElement("span", null)})
                    ), 
                    React.createElement(List, {subheader: "项目仓库"}, 
                         this.state.repoInfo.length == 0 ?
                            React.createElement("div", {style: styles.repoEmpty}, "没有仓库信息") :
                            React.createElement(Menu, {menuItems: this.state.repoInfo, autoWidth: false, zDepth: 0, selectedIndex: this.state.config.repo_cur, style: styles.repoMenu, onItemTap: this._onMenuTap, onItemPress: this._onMenuPress}), 
                         
                        React.createElement(IconButton, {tooltip: "添加Git仓库", iconClassName: "git-add icon-add", style: styles.addRepoBtn, onClick: this._addRepo})
                    ), 
                    React.createElement(ListDivider, null), 
                    React.createElement(List, {subheader: "WEINRE"}, 
                        React.createElement(ListItem, {rightToggle: React.createElement(Toggle, {ref: "weinreSwitch", onToggle: this._weinreSwitch, defaultToggled: this.state.weinreOnState})}, "远程调试")
                    ), 
                    React.createElement(ListDivider, null), 
                    React.createElement(List, {subheader: "HRT代理"}, 
                        React.createElement(ListItem, {rightToggle: React.createElement(Toggle, {ref: "proxySwitch", onToggle: this._proxySwitch, defaultToggled: this.state.proxyOnState})}, "开启代理"), 
                        React.createElement(ListItem, {rightToggle: React.createElement(Toggle, {ref: "proxySilent", onToggle: this._proxySilent, defaultToggled: this.state.config.hrt_silent || false})}, "安静模式"), 
                        React.createElement(ListItem, {rightToggle: React.createElement(Toggle, {ref: "proxyDebug", onToggle: this._proxyDebug, defaultToggled: this.state.config.hrt_debug || false, disabled: this.state.config.hrt_silent || false})}, "调试模式"), 
                        React.createElement(ListItem, {rightToggle: React.createElement(TextField, {ref: "port", defaultValue: this.state.config.hrt_port, style: styles.listTextField, onBlur: this._changePort})}, "端口设置")
                    )
                ), 
                React.createElement("div", {style: styles.main}, 
                    React.createElement(Tabs, {initialSelectedIndex: 0}, 
                        React.createElement(Tab, {label: "文件发布", style: styles.tabFontSize}, 
                            React.createElement("div", {className: "tab-content", style: tabContentStyle}, 
                                React.createElement("span", {style: styles.label}, "分支"), 
                                React.createElement(DropDownMenu, {ref: "branch", selectedIndex: this.state.branchMenuIndex, menuItems: this.state.branchMenuItems, menuStyle: styles.dropMenu, style: styles.dropDown, onChange: this._onDropMenuChange}), 
                                React.createElement("span", {style: styles.label}, "环境"), 
                                React.createElement(DropDownMenu, {ref: "env", selectedIndex: this.state.serverMenuIndex, menuItems: this.state.serverMenuItems, menuStyle: styles.dropMenu, style: styles.dropDown, onChange: this._onDropMenuChange}), React.createElement("br", null), 
                                React.createElement("span", {style: styles.label}, "项目"), 
                                React.createElement("select", {name: "project", "data-placeholder": "请选择", className: "project-items", multiple: "multiple", style: styles.projectSelect}), 
                                React.createElement(FlatButton, {label: "提取文件", primary: true, disabled: this.state.publishDisable, style: styles.getFileListBtn, labelStyle: styles.buttonLabelSize, onClick: this._getFileList})
                            )
                        ), 
                        React.createElement(Tab, {label: "模版发布", style: styles.tabFontSize}, 
                            React.createElement("div", {className: "tab-content", style: tabTemplateStyle, id: "templateList"}, 
                                React.createElement("div", {className: "tpl-filter"}, 
                                    React.createElement("input", {ref: "filter", type: "text", onChange: this._onTplFilterChange, placeholder: "查找模版"})
                                ), 
                                 this.renderVmList() 
                            )
                        )
                    ), 
                    React.createElement(Console, {ref: "console", listen: true, style: styles.consoleFrame})
                )
            )
        );
    },

    _getTabContentHeight() {
        var consoleHeight = styles.consoleFrame.height;
        return $(window).height() - consoleHeight - 48;
    },

    _initPublishUI() {
        var cur = this.state.config.repo_cur;
        var repo = this.state.repoInfo[cur];
		if (!repo) return;
        this.setState({ publishDisable: true });

        var recent = chips.getRecentData(repo.text);

        // 读取远程sdm-config文件
        chips.checkRemote(repo.configUrl, (config) => {
            this.refs.console.clear();
            // console.info('仓库位置: ', config.git_repository);
            CONFIG = config;
            chips.setRepoPath(config.remote_folder);
			// 环境
			this.state.serverMenuItems = [];
			Object.keys(config.env).forEach((val, i) => {
				if (this._hasPermission(val)) {
					this.state.serverMenuItems.push({ text: val, payload: i, type: 'env' });
                    if (recent.env == val) {
                        this.state.serverMenuIndex = i;
                    }
				}
			});
            // 分支
            this.state.branchMenuItems = [];
            chips.getBranch(config.git_repository, (branches) => {
                Object.keys(branches).forEach((val, i) => {
                    this.state.branchMenuItems.push({ text: val, payload: i, type: 'branch' });
                    if (recent.branch == val) {
                        this.state.branchMenuIndex = i;
                    }
                });
                this.setState({
                    branchMenuItems: this.state.branchMenuItems,
                    serverMenuItems: this.state.serverMenuItems,
                    branchMenuIndex: this.state.branchMenuIndex,
                    serverMenuIndex: this.state.serverMenuIndex,
                    publishDisable: false
                });
                // 菜单滚动到选中位置
                var menuItems = this.refs.branch.refs.menuItems;
                var $menu = $(menuItems.getDOMNode());
                var $item = $menu.find('div').eq(this.refs.branch.state.selectedIndex);
                $menu.get(0).scrollTop = $item.offset().top - $menu.offset().top;
            });
			// 项目
			var i = 0;
            this.$projectItems.empty();
			$.each(config.project, (key, val) => {
				this.$projectItems.get(0).options[i] = new Option(key + '（' + val.title + '）', key);
				i++;
			});
            if (recent.project) {
                this.$projectItems.val(recent.project);
            }
			this.$projectItems.trigger("chosen:updated");
        });
    },

    _initPublishVM() {
        var body = document.body;
		var holder = document.getElementById('templateList');
		body.ondrop = body.ondragover = body.ondragleave = body.ondragend = () => { return false; };
		holder.ondragover = holder.ondragleave = holder.ondragend = () => { return false; };
		holder.ondrop = e => {
			e.preventDefault();
            var isExist = false;
			var file = e.dataTransfer.files[0];
            if (this.state.config.repo_data.length === 0) {
                this.refs.dialog.alert('请添加仓库信息');
                return;
            }
            // 直接载入配置文件
            if (Path.basename(file.path) == 'project.json') {
                try {
                    var fileData = JSON.parse(util.readFile(file.path));
                    Object.keys(fileData).forEach((key) => {
                        chips.setProject(key, { path: fileData[key], env: '' });
                    });
                } catch(e) {
                    console.error(e.message);
                    return;
                }
                this.setState({ projectInfo: chips.getProject() });
                return;
            }
            Object.keys(this.state.projectInfo).forEach((key) => {
                var data = this.state.projectInfo[key];
                if (file.path.indexOf(data.path) > -1) {
                    isExist = true;
                    return;
                }
            });
            if (isExist) {
                this.refs.dialog.alert('发布列表中已存在此文件或目录');
            } else {
                this.refs.tplSetting.show({
                    path: Path.extname(file.path) ? Path.dirname(file.path) : file.path,
                    callback: this._onTplListChange
                });
            }
		};
    },

    _userSetting() {
        this.refs.userSetting.show();
    },

    _addRepo() {
        this.refs.repoSetting.show();
    },

    _weinreSwitch() {
        var repo = this.state.repoInfo;
        if (!this.weinre) {
            this.weinre = weinre.run({
                httpPort: 9001,
                boundHost: '-all-',
                verbose: false,
                debug: false,
                readTimeout: 20,
                deathTimeout: 50
            });
            this.weinreWindow = new AppWindow({ width: 1000, height: 700 });
            this.weinreWindow.loadUrl('http://localhost:9001/client/');
            this.weinreWindow.on('close', () => {
                if (this.weinre) {
                    this._weinreSwitch();
                    this.winreWindow = null;
                }
            });
            if (this.hrt) {
				this.hrt.update({
                    repo: repo,
                    silent: this.state.config.hrt_silent,
                    debug: this.state.config.hrt_debug,
                    weinre: true
                });
			}
            this.setState({ weinreOnState: true });
        } else {
            this.setState({ weinreOnState: false });
            if (this.hrt) {
				this.hrt.update({
                    repo: repo,
                    silent: this.state.config.hrt_silent,
                    debug: this.state.config.hrt_debug,
                    weinre: false
                });
			}
            if (this.weinreWindow) {
                this.weinreWindow.hide();
                this.weinreWindow = null;
            }
            this.weinre.close();
            this.weinre = null;
        }
    },

    _proxyProcess() {
        if (!this._isProxyProcessing) {
            this._isProxyProcessing = true;
            this.refs.console.log('[rewrite] ' + new Date);
        }
        if (this._proxyProcessTimer) {
            clearTimeout(this._proxyProcessTimer);
        }
        this._proxyProcessTimer = setTimeout(() => {
            this._isProxyProcessing = false;
        }, 1000);
    },

    _proxySwitch(e, checked) {
        var port = $.trim(this.refs.port.getValue());
        if (!this.hrt) {
            this.hrt = new hrt({ repo: this.state.repoInfo, weinre: !!this.weinre });
            this.hrt.silent(this.state.config.hrt_silent);
            this.hrt.debug(this.state.config.hrt_debug);
            this.hrt.event.on('rewrite', () => {
                if (this.state.config.hrt_silent) {
                    this._proxyProcess();
                }
            });
        }
        if (checked) {
            this.refs.console.clear();
            this.hrt.start(port);
        } else {
            this.hrt.close();
        }
        this.setState({ proxyOnState: checked });
    },

    _proxySilent(e, checked) {
        if (this.hrt) {
            this.hrt.silent(checked);
        }
        this.refs.console.clear();
        this.state.config.hrt_silent = checked;
        this.setState(this.state.config);
        chips.saveConfig();
    },

    _proxyDebug(e, checked) {
        if (this.hrt) {
            this.hrt.debug(checked);
        }
        this.state.config.hrt_debug = checked;
        this.setState(this.state.config);
        chips.saveConfig();
    },

    _changePort(e) {
        var $target = $(e.target);
        var port = $target.val();
        if (!port) {
            $target.val(this.state.config.hrt_port);
            return;
        }
        if (this.hrt && this.hrt.isAlive) {
            this.hrt.close();
            this.hrt.start(port);
        }
        this.state.config.hrt_port = port;
        this.setState(this.state);
        chips.saveConfig();
    },

    _onSubmitUser(data) {
        chips.setUserInfo(data);
        this.state.userInfo = data;
        this.setState(this.state);
		this._initPublishUI();
    },

    _onSubmitRepo(data) {
        var repo = this.state.repoInfo;
        chips.checkRemote(data.configUrl, (str) => {
            repo.push(data);
            chips.addRepoInfo(data);
            this.setState(repo);
			if (repo.length == 1) {
				this._initPublishUI();
			}
			if (this.hrt) {
				this.hrt.update({ repo: repo });
			}
        });
    },

    _onMenuTap(e, index) {
        if (this.state.publishDisable) return;
        if (this.state.config.repo_cur == index) return;
        this._saveRecent(); // 保存用户之前的选项
        this.state.config.repo_cur = index;
        this.state.publishDisable = true;
        this.state.branchMenuIndex = 0;
        this.state.serverMenuIndex = 0;
        this.setState(this.state);
        this.$projectItems.empty();
        this._initPublishUI();
        chips.saveConfig();
    },

    _onMenuPress(e, index) {
        if (this.state.publishDisable) return;
        this.refs.dialog.confirm('确认移除仓库信息？', () => {
            var info = this.state.config.repo_data[index];
            var curIndex = this.state.config.repo_cur;
            chips.removeRepoInfo(info);
            if (curIndex >= index) {
                this.state.config.repo_cur = Math.max(curIndex - 1, 0);
                this.setState(this.getInitialState(), () => {
                    this.$projectItems.empty().trigger("chosen:updated");
                    this._initPublishUI();
                });
            } else {
                this.setState({
                    config: chips.config(),
                    repoInfo: chips.getRepoInfo()
                });
            }
            chips.saveConfig();
        });
    },

    _onDropMenuChange(e, index, item) {
        if (item.type == 'branch') {
            this.state.branchMenuIndex = index;
        } else {
            this.state.serverMenuIndex = index;
        }
    },

    _getFileList() {
        var dialog = this.refs.dialog;

        var cur = this.state.config.repo_cur;
        var repo = this.state.repoInfo[cur];

		var branch = this.refs.branch.getInputNode().value;
		var env = this.refs.env.getInputNode().value;

		// 待发布的文件列表
		var filePathList = [];
		// 待发布的文件URL列表
		var fileUrlList = [];

        if (!branch) {
			dialog.alert('请选择分支');
			return;
        }

		var envConfig = CONFIG.env[env];
		if (!envConfig) {
			dialog.alert('请选择环境');
			return;
		}
		var ftpConfig = envConfig.upload;
		var sshConfig = envConfig.uiversion;

		var project = this.$projectItems.val();
		if (project == null) {
			dialog.alert('请选择项目');
			return;
		}

		var projectFileMap = {};
		project.forEach((p) => {
			var projectConfig = CONFIG.project[p];
			if (projectConfig.files) {
				projectConfig.files.forEach((file) => {
					projectFileMap[file] = true;
				});
			}
		});
		var projectFiles = Object.keys(projectFileMap);

        this.refs.console.clear();
        this.setState({ publishDisable: true });
		console.info('开始更新代码 ...');

		var buildPath = Path.join(chips.getRepoPath(), 'build');

		chips.pullRemote(branch, () => {
			console.info('开始提取要发布的文件 ...');
			var paths = grepFiles(buildPath, projectFiles);

			chips.extractFiles(paths, (paths) => {

				chips.getTargetFiles(paths, envConfig, (paths) => {
					filePathList = [];
					paths.forEach((path) => {
						filePathList.push(path);
						var relativePath = Path.relative(Path.join(chips.filesPath, chips.getCloneFolder()), path);
						var buildRelativePath = relativePath.replace(/^dist/, 'build');
						var fileUrl = repo.gitUrl + '/raw/' + branch + '/' + buildRelativePath.split(Path.sep).join('/');
						fileUrlList.push(fileUrl);
					});

                    this.setState({ publishDisable: false });

					if (!fileUrlList.length) {
						console.warn('未找到需要发布/打包的文件！');
						return;
					}
					if (env == 'www') {
                        this.refs.filelist.show({
                            btnName: '打包',
                            title: '准备打包：将以下文件压缩后打包到 uiversion.zip',
                            filelist: this._getPublishFileList(fileUrlList),
                            callback: zipFiles.bind(this)
                        });
					} else {
                        this.refs.filelist.show({
                            btnName: '发布',
                            title: '准备发布：将以下文件压缩后发布到' + env + '环境',
                            filelist: this._getPublishFileList(fileUrlList),
                            callback: deployFiles.bind(this)
                        });
					}
				});
			}, () => {
                this.setState({ publishDisable: false });
            });
		});

        function zipFiles(checkedItems) {
            if (filePathList.length === 0) {
    			console.warn('没有可打包的文件');
    			return;
    		}
            if (checkedItems.length === 0) {
    			console.warn('没选择打包的文件');
    			return;
            }
            this.refs.filelist.close();
    		var filterFileUrlList = [], filterFilePathList = [];
            checkedItems.forEach((item) => {
                var index = item.index;
    			if (filePathList[index] && fileUrlList[index] ){
    				filterFileUrlList.push(fileUrlList[index]);
    				filterFilePathList.push(filePathList[index]);
    			}
            });
            this.setState({ publishDisable: true });
    		console.info('开始打包文件 ...');
    		chips.saveZipFile(filterFilePathList, filterFileUrlList, () => {
                this.setState({ publishDisable: false });
            });
        }

        function deployFiles(checkedItems) {
            if (!this._hasPermission(env)) {
    			console.warn('没有发布权限');
    			return;
    		}
    		if (!ftpConfig) {
    			console.warn('暂时不支持发布到' + env + '环境');
    			return;
    		}
            this.refs.filelist.close();
            this.setState({ publishDisable: true });

    		if (filePathList.length === 0) {
    			console.info('没有可发布的文件');
    			console.info('开始版本化 ...');
    			chips.updateVersion(sshConfig, env, () => {
                    this.setState({ publishDisable: false });
                });
    		} else {
    			var filterFilePathList = [];
                checkedItems.forEach((item) => {
                    var index = item.index;
                    if (filePathList[index]) {
                        filterFilePathList.push(filePathList[index]);
                    }
                });
    			console.info('开始上传文件 ...');
    			chips.uploadByFtp(ftpConfig, sshConfig, filterFilePathList, env, () => {
                    this.setState({ publishDisable: false });
                });
    		}
        }
    },

    _getPublishFileList(fileUrlList) {
        var filelist = [];
        fileUrlList.forEach((item, index) => {
            filelist.push({ path: item, index: index, checked: true });
        });
        return filelist;
    },

	_hasPermission(env) {
		var users = CONFIG.env && CONFIG.env[env].users;
		if (!users) {
			return false;
		}
		if ($.inArray('*', users) >= 0) {
			return true;
		}
		return $.inArray(chips.getUserInfo().username, users) >= 0;
	},

    _saveRecent() {
        var cur = this.state.config.repo_cur;
        var repo = this.state.repoInfo[cur];
        if (!repo) return;
        var recent = {
            env: this.refs.env.getInputNode().value,
            branch: this.refs.branch.getInputNode().value,
            project: this.$projectItems.val()
        };
        chips.saveRecentData(repo.text, recent);
    },

    _publishAction(e) {
        e.preventDefault();
        var $target = $(e.target);
        var path = $target.attr('data-path');
        var project = $target.attr('data-project');
        var env = $target.parent().find('select').val();
        this.refs.console.clear();
        vm.publish(path, project, env);
    },

    _onTplListChange(data) {
        chips.setProject(data.name, { path: data.path, env: '' });
        this.setState({
            projectInfo: chips.getProject(),
            serverInfo: chips.getServerInfo()
        });
    },

    _onTplFilterChange(e) {
        var filter = $.trim(e.target.value);
        if (this._filterTimer) {
            clearTimeout(this._filterTimer);
        }
        this._filterTimer = setTimeout(() => {
            this.state.projectFilter = filter.toLowerCase();
            this.forceUpdate();
            this.refs.filter.getDOMNode().focus();
        }, 20);
    },

    _removeTplPath(e) {
        var project = $(e.target).attr('data-key');
        this.refs.dialog.confirm('确认移除模版信息？', () => {
            chips.removeProject(project);
            this.setState({ projectInfo: chips.getProject() });
        });
    },

    _openFile(e) {
        e.preventDefault();
        if (process.platform == 'darwin') {
            util.execCmd('open ' + $(e.target).attr('data-path'), null, null, null, null, true);
        } else if (process.platform == 'win32') {
            util.execCmd('start ' + $(e.target).attr('data-path'), null, null, null, null, true);
        }
    }

});


setTimeout(function(){
    var app = React.render(React.createElement(App, null), document.body);
    remote.getCurrentWindow().show();

    // 控制台菜单
    document.querySelector('.console').contentWindow.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        var menu = new AppMenu();
        menu.append(new AppMenuItem({ label: '清除控制台信息', click: () => { app.refs.console.clear() } }));
        menu.popup(remote.getCurrentWindow());
    });

    // App菜单
    var template = [
      {
        label: 'Chips',
        submenu: [
          {
            label: '关于 Chips',
            selector: 'orderFrontStandardAboutPanel:'
          },
          {
            type: 'separator'
          },
          {
            label: '关闭',
            accelerator: 'Command+Q',
            selector: 'terminate:'
          },
        ]
      },
      {
        label: '编辑',
        submenu: [
          {
            label: '剪切',
            accelerator: 'Command+X',
            selector: 'cut:'
          },
          {
            label: '复制',
            accelerator: 'Command+C',
            selector: 'copy:'
          },
          {
            label: '粘贴',
            accelerator: 'Command+V',
            selector: 'paste:'
          },
          {
            label: '全选',
            accelerator: 'Command+A',
            selector: 'selectAll:'
          }
        ]
      },
      {
        label: '视图',
        submenu: [
          {
            label: '重新加载',
            accelerator: 'Command+R',
            click: function() { remote.getCurrentWindow().reload(); }
          },
          {
            label: '开启调试工具',
            accelerator: 'Alt+Command+I',
            click: function() { remote.getCurrentWindow().toggleDevTools(); }
          },
        ]
      },
      {
        label: '工具',
        submenu: [
          {
            label: '开启/关闭代理',
            accelerator: 'Command+Shift+H',
            click: function() {
                if (app.hrt && app.hrt.isAlive) {
                    app._proxySwitch(null, !(app.hrt && app.hrt.isAlive));
                } else {
                    app._proxySwitch(null, true);
                }
            }
          }
        ]
      }
    ];
    if (process.platform == 'darwin') {
        AppMenu.setApplicationMenu(AppMenu.buildFromTemplate(template));
    }
}, 100);

window.onerror = function(str) {
	console.error(str);
};
