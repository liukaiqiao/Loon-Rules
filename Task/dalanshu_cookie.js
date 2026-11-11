/*
  大蓝树 (dalanshu.top) 自动签到与抓包二合一脚本 (终极版)
  支持自动拦截保存最新 Token + 强力清洗换行符 + 自动签到
  保存路径：Task/Dalanshu_checkin.js
*/

const $ = new Env("大蓝树自动签到");
const checkinUrl = "https://dalanshu.top/api/v1/me/checkin";
const TOKEN_KEY = "my_dalanshu_fresh_token";

// 判断当前是“抓包触发”还是“定时签到触发”
if (typeof $request !== "undefined" && $request.headers) {
  getCookie();
} else {
  checkIn();
}

// 1. 抓包保存最新 Token 逻辑
function getCookie() {
  const headers = $request.headers;
  const auth = headers["Authorization"] || headers["authorization"] || headers["AUTHORIZATION"];
  const sessionId = headers["x-session-id"] || headers["X-Session-Id"] || "";
  const deviceId = headers["x-device-id"] || headers["X-Device-Id"] || "";

  if (auth) {
    // 强力清洗：去掉 Bearer 前缀以及所有隐藏的换行符、空格
    const cleanToken = auth.replace(/Bearer/gi, "").replace(/[\r\n\s]+/g, "");
    $.write(cleanToken, TOKEN_KEY);
    if (sessionId) $.write(sessionId.replace(/[\r\n\s]+/g, ""), "my_dalanshu_session");
    if (deviceId) $.write(deviceId.replace(/[\r\n\s]+/g, ""), "my_dalanshu_device");

    $.msg("🎉 大蓝树最新 Token 抓取成功", "", `新凭证尾号: ...${cleanToken.slice(-8)}`);
    $.log(`✅ 成功保存最新 Token: ${cleanToken}`);
  } else {
    $.log("⚠️ 请求头中未找到 Authorization 字段");
  }
  $done({});
}

// 2. 定时执行签到逻辑
async function checkIn() {
  // 优先读取我们自己刚刚抓到的最新鲜 Token，其次才兜底读取旧变量
  let token = $.read(TOKEN_KEY) || $.read("fmz200_dalanshu_authorization") || $.read("dalanshu_token");
  
  if (!token) {
    $.log("❌ 未检测到大蓝树 Token，请先打开大蓝树触发抓包！");
    $.msg("大蓝树签到失败", "未找到 Token", "请先打开大蓝树个人中心触发抓包");
    $done();
    return;
  }

  // 强力清洗所有换行符、回车符、空格和重复的 Bearer
  token = token.replace(/Bearer/gi, "").replace(/[\r\n\s]+/g, "");
  const authHeader = `Bearer ${token}`;
  
  $.log(`🔑 正在使用尾号为 [...${token.slice(-8)}] 的鉴权头: ${authHeader}`);

  const headers = {
    "Authorization": authHeader,
    "Accept": "*/*",
    "Content-Type": "application/json",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    "User-Agent": "app/100468 CFNetwork/3860.200.71 Darwin/25.1.0"
  };

  // 如果抓到了设备号和会话号，一并带上防止服务器校验设备拒绝
  const sessionId = $.read("my_dalanshu_session");
  const deviceId = $.read("my_dalanshu_device");
  if (sessionId) headers["x-session-id"] = sessionId;
  if (deviceId) headers["x-device-id"] = deviceId;

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

function Env(name) {
  this.name = name;
  this.isLoon = typeof $loon !== "undefined";
  this.isQX = typeof $task !== "undefined";
  
  this.read = (key) => {
    if (this.isLoon) return $persistentStore.read(key);
    if (this.isQX) return $prefs.valueForKey(key);
    return null;
  };

  this.write = (val, key) => {
    if (this.isLoon) return $persistentStore.write(val, key);
    if (this.isQX) return $prefs.setValueForKey(val, key);
    return false;
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