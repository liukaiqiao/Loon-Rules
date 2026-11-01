#!name=腾讯视频净化
#!desc=去除开屏广告、视频播放前广告、底部的多余 tap 栏、我的页面美化、我的界面顶部广告
#!author=TG@ZenMoFiShi
#!icon=https://github.com/Toperlock/Quantumult/raw/main/icon/Doraemon/Doraemon-1041.png
#!update=2026-10-27

[Rule]
DOMAIN,iacc.stgw.qq.com,REJECT
DOMAIN,tacc.video.qq.com,REJECT

[Script]
http-request ^https?:\/\/i\.video\.qq\.com\/(?:\?.*)?$ script-path=https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/Txvideoad.js, requires-body=true, timeout=60, tag=Txvideoad

http-response ^https?:\/\/i\.video\.qq\.com\/(?:\?.*)?$ script-path=https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/Txvideoad.js, requires-body=true, timeout=60, tag=Txvideoad

http-response ^https?:\/\/iacc\.qq\.com\/(?:\?.*)?$ script-path=https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/Txvideoad.js, requires-body=true, timeout=60, tag=Txvideoad

http-response ^https?:\/\/config\.ab\.qq\.com\/tab\/GetTabRemoteConfig(?:\?.*)?$ script-path=https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/Txvideoad.js, requires-body=true, timeout=60, tag=Txvideoad

http-response ^https:\/\/rdelivery\.qq\.com\/v1\/sdkconfig\/get(?:\?.*)?$ script-path=https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/Txvideoad.js, requires-body=true, timeout=60, tag=Txvideoad

[MITM]
hostname = i.video.qq.com, iacc.qq.com, config.ab.qq.com, rdelivery.qq.com
