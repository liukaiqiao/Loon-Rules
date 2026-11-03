/
￼ 大蓝树自动签到脚本 (增强版)
￼ 配合 DaLanShu_Checkin.plugin 使用
*/
const $ = new Env("大蓝树签到");
const tokenKey = "dalanshu_token";
async function signin() {
console.log("🔔 [大蓝树] 签到任务开始执行...");
const token = $.getVal(tokenKey);
if (!token) {
console.log("❌ [大蓝树] 未找到 Token，请先登录网页获取！");
.msg(.name, "❌ 签到失败", "未找到 Token，请先登录网页或打开个人中心获取！");
$.done();
return;
}
const url = "https://dalanshu.top/api/v1/me/checkin";
const headers = {
"Cookie": token,
"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
};
const request = {
url: url,
headers: headers,
timeout: 60000
};
$.post(request, (error, response, data) => {
try {
if (error) {
console.log(⁠❌ [大蓝树] 请求出错: ${JSON.stringify(error)}⁠);
￼.name, "❌ 签到请求失败", error);
return;
}
console.log(⁠📥 [大蓝树] 收到服务器响应: ${data}⁠);
const result = JSON.parse(data);
if (result.code === 200 || result.success || (result.message && result.message.includes("成功"))) {
￼.name, "🎉 签到成功", result.message || "今日签到已完成！");
} else {
￼.name, "⚠️ 签到提示", result.message || data);
}
} catch (e) {
console.log(⁠❌ [大蓝树] 解析响应异常: ${e.message}, 原始数据: ${data}⁠);
￼.name, "❌ 解析响应异常", e.message);
} finally {
$.done();
}
});
}
// 兼容 Loon 环境的简易 Env 构造器
function Env(name) {
this.name = name;
this.getVal = (key) => $persistentStore.read(key);
this.setVal = (key, val) => $persistentStore.write(val, key);
this.msg = (title, subtitle, detail) => $notification.post(title, subtitle, detail);
this.post = (opts, callback) => $httpClient.post(opts, callback);
this.done = (value = {}) => $done(value);
}
signin();
