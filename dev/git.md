#git 常用操作
##常用操作
1. 分支 改动的内容

	`git show 12e665b28`
	
2. 撒销一个合并

	如果你觉得你合并后的状态是一团乱麻，想把当前的修改都放弃，你可以用下面的命令回到合并之前的状态：

	`git reset --hard HEAD`

	或者你已经把合并后的代码提交，但还是想把它们撒销：

	`git reset --hard ORIG_HEAD`

3. 分支修改过的文件

	`git diff master --name-only `

4. “强制”的将改动推到远程：

	`git reset --hard 34eqfds`

	`git push origin master --force` or  `git push origin +master	`
5. 不小心在develop上进行开发时解决方案

	```
	# 未提交时
	git stash
	git checkout [BRANCH_NAME]
	git stash pop

	# 已提交时
	git log -1 # 记住COMMIT ID
	git reset --hard origin/develop
	git checkout [BRANCH_NAME]
	git cherry-pick [COMMIT_ID]
	```
6. diff 
git diff  3a50ab1f da1bc0169  filePath 

# 删除 untracked files
git clean -f
 
# 连 untracked 的目录也一起删掉
git clean -fd

git fetch origin

 git diff HEAD -- src/css/find/c_pack.less
## Alias
	ca = commit --amend
	ci = commit -a -v
	br = branch
	bv = branch -vv
	co = checkout
	cb = checkout -b
	df = diff
	un = reset --hard HEAD
	uh = reset --hard HEAD^
	ll = log --pretty=format:"%C(yellow)%h%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --numstat
	ld = log --pretty=format:"%C(yellow)%h\\ %C(green)%ad%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=short --graph
	ls = log --pretty=format:"%C(green)%h\\ %C(yellow)[%ad]%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=relative



7.git conflict

	git add src/js/page/find/main/recommend.js

	git rebase --continue 

8.
git reset --hard 5787a749b8c
git ps -f  origin develop	
##git脚本 	[git.sh](src/git.sh) [td-git.sh](src/td-git.sh)
	`chomd +x git.sh` -> `./git.sh`



##常用SVN命令
	新建分支 svn cp -m '创建有料项目模板分支 by mushaofeng' https://player.svn.intra.tudou.com/svn/static/trunk/html  https://player.svn.intra.tudou.com/svn/static/branches/html/youliao