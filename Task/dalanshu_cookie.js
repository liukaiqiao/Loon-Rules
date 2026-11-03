/*
  大蓝树 (dalanshu.top) 自动签到脚本
  适配 Loon / Quantumult X / Surge 多端环境
  请将此文件保存至 GitHub 的 Task 文件夹中：Task/dalanshu.js
*/

const $ = new Env("大蓝树自动签到");
const statusUrl = "https://dalanshu.top/api/v1/me/checkin/status";
const checkinUrl = "https://dalanshu.top/api/v1/me/checkin";

// 1. 执行定时签到主逻辑
async function checkIn() {
  let token = $.read("dalanshu_token");
  if (!token) {
    $.log("❌ 未检测到大蓝树 Token，请先在浏览器登录并打开个人中心以自动抓取！");
    $.msg("大蓝树签到失败", "未找到 Token", "请先打开网页登录并触发抓包");
    return;
  }

  // 确保去掉可能重复的 Bearer 前缀
  token = token.replace(/^Bearer\s+/i, "").trim();

  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
  };

  // 先检查签到状态
  $.get({ url: statusUrl, headers: headers }, (error, response, data) => {
    try {
      if (error) {
        $.log(`❌ 网络请求失败: ${error}`);
        return;
      }
      const result = JSON.parse(data);
      if (result && result.code === 200) {
        if (result.data && result.data.is_checkin) {
          $.msg("大蓝树签到", "今日已签到", "无需重复签到！");
          return;
        }
      }

      // 发起签到请求
      $.post({ url: checkinUrl, headers: headers, body: "{}" }, (err, resp, body) => {
        try {
          const res = JSON.parse(body);
          if (res && (res.code === 200 || res.success)) {
            $.msg("🎉 大蓝树签到成功", "", "获得积分奖励，快去看看吧！");
            $.log("✅ 签到成功: " + body);
          } else {
            $.msg("⚠️ 大蓝树签到提示", "", res.message || "签到返回异常");
            $.log("⚠️ 签到异常响应: " + body);
          }
        } catch (e) {
          $.log("❌ 解析签到响应失败: " + e);
        }
      });

    } catch (e) {
      $.log("❌ 解析状态响应失败: " + e);
    }
  });
}

// 启动入口
checkIn();

// ==========================================
// 兼容多端运行的 Env 框架
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

  this.write = (key, val) => {
    if (this.isLoon) return $persistentStore.write(val, key);
    if (this.isQX) return $prefs.setValueForKey(val, key);
    return false;
  };

  this.log = (msg) => console.log(`[${this.name}] ${msg}`);
  
  this.msg = (title, subtitle, body) => {
    if (this.isLoon) $notification.post(title, subtitle, body);
    if (this.isQX) $notify(title, subtitle, body);
  };

  this.get = (opts, callback) => {
    if (this.isLoon) $httpClient.get(opts, callback);
    if (this.isQX) {
      opts.method = "GET";
      $task.fetch(opts).then(res => callback(null, { status: res.statusCode }, res.body), err => callback(err));
    }
  };

  this.post = (opts, callback) => {
    if (this.isLoon) $httpClient.post(opts, callback);
    if (this.isQX) {
      opts.method = "POST";
      $task.fetch(opts).then(res => callback(null, { status: res.statusCode }, res.body), err => callback(err));
    }
  };
}
