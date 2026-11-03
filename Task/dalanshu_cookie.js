/*
  大蓝树 (dalanshu.top) 自动签到脚本 (精准适配 Dalanshu_checkin.js)
  完美对接 fmz200 的 get_cookie.js 存储键名，彻底解决 401 鉴权报错
  保存路径：Task/Dalanshu_checkin.js
*/

const $ = new Env("大蓝树自动签到");
const checkinUrl = "https://dalanshu.top/api/v1/me/checkin";

async function checkIn() {
  // 完美对齐 fmz200 默认抓取脚本存入的变量名
  let token = $.read("fmz200_dalanshu_authorization") || $.read("dalanshu_token") || $.read("dalanshu_authorization");
  
  if (!token) {
    $.log("❌ 未检测到大蓝树 Token，请先打开大蓝树网页触发抓包！");
    $.msg("大蓝树签到失败", "未找到 Token", "请先打开大蓝树个人中心触发抓包");
    $done();
    return;
  }

  // 智能处理 Bearer 前缀，确保鉴权格式完美合规
  token = token.trim();
  const authHeader = token.startsWith("Bearer") ? token : `Bearer ${token}`;
  $.log("🔑 当前使用的鉴权头: " + authHeader);

  const headers = {
    "Authorization": authHeader,
    "Accept": "*/*",
    "Content-Type": "application/json",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    "User-Agent": "app/100468 CFNetwork/3860.200.71 Darwin/25.1.0"
  };

  // 发起签到请求 (POST)
  $.post({ url: checkinUrl, headers: headers, body: "{}" }, (err, resp, body) => {
    try {
      if (err) {
        $.log("❌ 签到网络请求失败: " + err);
        $done();
        return;
      }
      $.log("📩 服务器返回原始数据: " + body);
      const res = JSON.parse(body);
      
      if (res && (res.code === 200 || res.code === 0 || res.success)) {
        const reward = (res.data && res.data.reward) ? `，获得: ${res.data.reward}` : "";
        $.msg("🎉 大蓝树签到成功", "", `今日签到已完成${reward}`);
      } else if (body.includes("已签到") || (res && res.msg && res.msg.includes("已"))) {
        $.msg("✅ 大蓝树签到", "今日已签到", res.msg || "无需重复签到！");
      } else {
        $.msg("⚠️ 大蓝树签到提示", "", res.msg || res.message || body);
      }
    } catch (e) {
      $.log("❌ 解析签到响应失败: " + e);
    } finally {
      $done();
    }
  });
}

checkIn();

// ==========================================
// 兼容 Loon / QX 的极简 Env 框架
// ==========================================
function Env(name) {
  this.name = name;
  this.isLoon = typeof $loon !== "undefined";
  this.isQX = typeof $task !== "undefined";
  
  this.read = (key) => {
    if (this.isLoon) return $persistentStore.read(key);
    if (this.isQX) return $prefs.valueForKey(key);
    return null;
  };

  this.log = (msg) => console.log(`[${this.name}] ${msg}`);
  
  this.msg = (title, subtitle, body) => {
    if (this.isLoon) $notification.post(title, subtitle, body);
    if (this.isQX) $notify(title, subtitle, body);
  };

  this.post = (opts, callback) => {
    if (this.isLoon) $httpClient.post(opts, callback);
    if (this.isQX) {
      opts.method = "POST";
      $task.fetch(opts).then(res => callback(null, { status: res.statusCode }, res.body), err => callback(err));
    }
  };
}
