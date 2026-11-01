#!name=网上国网
#!desc=某些APP要清除缓存或者重新安装拦截广告才会生效！
#!author=奶思
#!icon=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/gif/naisi-01.gif
#!homepage=https://github.com/fmz200/wool_scripts
#!raw-url=https://github.com/fmz200/wool_scripts/raw/main/QuantumultX/rewrite/split/partW/WangShangGuoWang.snippet
#!tg-group=https://t.me/QuantumultXCommunity
#!date=undefined

[Rewrite]
#############################################
^https?:\/\/(?>csc|osg)-service\.sgcc\.com\.cn:\d+\/emss-pfa-appset-front\/appForceUpdate - reject
^https?:\/\/(?>csc|osg)-service\.sgcc\.com\.cn:\d+\/emss-pfa-appset-front\/appSync\/getAppForceUpgrade - reject
^https?:\/\/(?>csc|osg)-service\.sgcc\.com\.cn:\d+\/emss-pfa-appset-front\/bootpageoutter\/ - reject-dict
^https?:\/\/(?>csc|osg)-service\.sgcc\.com\.cn:\d+\/.*\/app_api\/selectInfoByCondition - reject-dict
^https?:\/\/(?>csc|osg)-service\.sgcc\.com\.cn:\d+\/.*\/inner\/cache - reject

[MITM]
hostname = osg-static.sgcc.com.cn, osg-service.sgcc.com.cn
