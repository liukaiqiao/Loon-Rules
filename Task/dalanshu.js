#!name=大蓝树每日签到
#!desc=每日自动签到达蓝树App，签到前自动抓取/更新授权Token（Loon原生兼容）
#!author=fmz200 / 适配Loon by Minis
#!homepage=https://github.com/fmz200/wool_scripts
#!icon=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/dalanshu.png

[Script]
http-request ^https:\/\/dalanshu\.top\/api\/v1\/me\/checkin\/status script-path=https://gist.githubusercontent.com/HeartsPartnered/65f018b189d83c5bb26443a356b8b3f8/raw/3f3305cc3b57de30bc43cdb22698f49499b1a7f3/dalanshu_token_loon.js, tag=大蓝树签到Token, requires-body=true, timeout=30, img-url=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/dalanshu.png

cron "30 8 * * *" script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/dalanshu/dalanshu_checkin.js, tag=大蓝树每日签到, timeout=60, img-url=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/dalanshu.png, enable=true

[MITM]
hostname = dalanshu.top

# 使用说明：
# 1) 首次使用：确保 Loon 已开启 MITM 并信任证书
# 2) 打开「大蓝树」App进入"我的"页，触发 checkin/status 请求自动抓取Token
# 3) 抓取成功会收到「大蓝树 签到参数获取成功」通知
# 4) 之后每日 08:30 自动签到，Token 存于 fmz200_dalanshu_authorization
