#!/bin/sh
brName=`git br |grep '*'`;
curBranch="";
echo $brName;
for loop in  $brName
do 
	curBranch=$loop
done	
git add -A

echo "请输入 ${curBranch} 分支的提交信息："
read  message
git ci -m "$message by mushaofeng @ $curBranch"
if [ $? == 1 ]
then
	exit;
fi
git ps origin $curBranch
if [ $? == 1 ]
then
	exit;
fi
if [ $1 == 'dev' ]
then
	exit;
else
git co develop
git pull origin develop
fi
