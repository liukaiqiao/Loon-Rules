/**
 * 大蓝树自动签到脚本
 * 配合 DaLanShu_Checkin.plugin 使用
 */

const $ = new Env("大蓝树签到");
const tokenKey = "dalanshu_token";

async function signin() {
  const token = $.getVal(tokenKey);
  if (!token) {
    $.msg($.name, "❌ 签到失败", "未找到 Token，请先登录网页或打开个人中心获取！");
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
        $.msg($.name, "❌ 签到请求失败", error);
        return;
      }
      
      const result = JSON.parse(data);
      if (result.code === 200 || result.success || (result.message && result.message.includes("成功"))) {
        $.msg($.name, "🎉 签到成功", result.message || "今日签到已完成！");
      } else {
        $.msg($.name, "⚠️ 签到提示", result.message || data);
      }
    } catch (e) {
      $.msg($.name, "❌ 解析响应异常", e);
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
