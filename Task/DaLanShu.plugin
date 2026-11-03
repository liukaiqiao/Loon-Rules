/*
  大蓝树专用 Token 抓取脚本 (Loon 原生适配)
  保存路径: Task/dalanshu_cookie.js
*/

const $ = new Env("大蓝树获取Token");

function getCookie() {
  // 从请求头中提取 Authorization 或 Cookie
  const req = typeof $request !== "undefined" ? $request : null;
  if (!req) {
    $.log("❌ 未获取到请求对象");
    return;
  }

  const headers = req.headers;
  // 尝试获取 Authorization
  const auth = headers["Authorization"] || headers["authorization"];

  if (auth) {
    $.write(auth.replace("Bearer ", ""), "dalanshu_token");
    $.msg("🎉 大蓝树 Token 获取成功", "", "已成功写入凭证，定时签到可以正常运行啦！");
    $.log("✅ 成功抓取 Token: " + auth);
  } else {
    $.log("⚠️ 未在请求头中找到 Authorization，请检查接口。");
  }
}

getCookie();

function Env(name) {
  this.name = name;
  this.write = (val, key) => $persistentStore.write(val, key);
  this.log = (msg) => console.log(`[${this.name}] ${msg}`);
  this.msg = (title, sub, body) => $notification.post(title, sub, body);
}
