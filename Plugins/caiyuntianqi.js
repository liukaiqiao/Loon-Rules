[javascript]
// 彩云天气 SVIP 终极防御修复版
let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 1. 核心权限修改 (加上 typeof 严谨判断，防止破坏原生结构)
        if (obj.result) {
            if (typeof obj.result.is_vip !== 'undefined') obj.result.is_vip = true;
            if (typeof obj.result.vip_type !== 'undefined') obj.result.vip_type = "s";
            if (typeof obj.result.svip_given !== 'undefined') obj.result.svip_given = 1;
            
            // 修复：针对部分用户遇到的功能失效，确保 wt 对象存在再修改
            if (obj.result.wt) {
                obj.result.wt.vip = obj.result.wt.vip || {};
                obj.result.wt.vip.svip_active = true;
            }
        }
        
        // 2. 老版本/特定页面的 VIP 信息
        if (obj.vip_info) {
            obj.vip_info.is_vip = true;
            obj.vip_info.vip_type = "s";
            obj.vip_info.expires_time = 4092599349;
        }

        // 3. 新版彩云增加的专属 svip_info 字段
        if (obj.svip_info) {
            obj.svip_info.is_vip = true;
            obj.svip_info.vip_type = "s";
            obj.svip_info.expires_time = 4092599349;
        }

        // 重新打包还给 App
        body = JSON.stringify(obj);
    } catch (e) {
        // 如果遇到无法解析的格式，直接放行，坚决不让 App 崩溃或失效
        console.log("彩云天气修改失败，已放行: " + e);
    }
}

$done({ body });
