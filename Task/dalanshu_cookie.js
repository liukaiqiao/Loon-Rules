/*
  大蓝树专用 Token 抓取脚本 (Loon 原生完美适配版)
  保存路径: Task/dalanshu_cookie.js
*/

function getCookie() {
  // 严谨判断 Loon 的 $request 对象
  if (typeof $request !== "undefined" && $request.headers) {
    const headers = $request.headers;
    // 兼容大小写的 authorization 字段
    const auth = headers["Authorization"] || headers["authorization"] || headers["AUTHORIZATION"];

    if (auth) {
      // 写入持久化存储
      $persistentStore.write(auth, "dalanshu_token");
      $notification.post("🎉 大蓝树 Token 获取成功", "", "凭证已完美写入，可以开始自动签到啦！");
      console.log("✅ 成功抓取并写入 Token: " + auth);
    } else {
      console.log("⚠️ 请求头中未找到 Authorization 字段");
    }
  } else {
    console.log("❌ 当前环境未检测到有效的 $request 对象");
  }
}

getCookie();
$done({});
