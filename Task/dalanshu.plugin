#!name=大蓝树自动签到 (自建重构版)
#!desc=大蓝树每日自动签到，包含获取Token与定时任务。
#!author=liukaiqiao
#!icon=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/dalanshu.png
[Script]
1. 获取 Token (优化：放宽了网址匹配规则，防止漏抓)
http-request ^https?://dalanshu.top/api/v1/me/checkin/status script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/cookie/get_cookie.js, requires-body=false, timeout=20, tag=大蓝树获取Token
2. 定时签到 (已同步修改为你最新的 dalanshu.js 链接！)
cron "0 7 * * *" script-path=https://raw.githubusercontent.com/liukaiqiao/Loon-Rules/refs/heads/main/Task/dalanshu.js, timeout=60, tag=大蓝树每日签到
[Mitm]
hostname = dalanshu.top
