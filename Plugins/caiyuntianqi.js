[javascript]
// 彩云天气 SVIP 完美修复版 (防功能失效)
let body = $response.body;
if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 核心修改逻辑：只修改 VIP 字段，绝不触碰其他正常数据
        if (obj.result) {
            obj.result.is_vip = true;
            obj.result.vip_type = "s";
            obj.result.svip_given = 1;
            
            // 确保高级功能开启，屏蔽广告开关
            if (obj.result.wt && obj.result.wt.vip) {
                obj.result.wt.vip.svip_active = true;
            }
        }
        
        // 如果是个人信息页，解锁到 2099 年
        if (obj.vip_info) {
            obj.vip_info.is_vip = true;
            obj.vip_info.vip_type = "s";
            obj.vip_info.expires_time = 4092599349;
        }

        // 重新打包还给 App
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        // 如果解析出错，原样返回，防止 App 崩溃
        $done({ body });
    }
} else {
    $done({});
}
