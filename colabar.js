/**
 * cron 26 8 * * *  colabar.js
 * Show:每天运行一次
 * @author:https://github.com/bh9fxk/checkin
 * 变量名: colabar_ck,&分隔两个参数
 * 修改/api3/onecrm/mactivity/sign/misc/sign/activity/c/signMainInfo中body中的
 * appid vid bosId productInstanceId productInstanceId wid
 * 变量值: 抓包X-WX-Token的值
 * scriptVersionNow = "0.0.1";
 */

const $ = new Env("可口可乐吧签到");
const notify = $.isNode() ? require('./sendNotify') : '';
const Notify = 1; //开启通知
let ckName = "colabar_ck";
let envSplitor = ["@", "\n"]; //多账号分隔符
let strSplitor = "&"; //多变量分隔符
let userIdx = 0;
let userList = [];
let msg = '';
class UserInfo {
    constructor(str) {
        this.index = ++userIdx;
        this.ck = str.split(strSplitor)[0]; //单账号多变量分隔
    }
    async main() {
	console.log(`\n开始第${this.index}个账号`)
	msg += `\n开始第${this.index}个账号`

	await this.user()
	await $.wait(3000)
	await this.coupon()
	await $.wait(3000)
        await this.checkin()
	await $.wait(3000)
	await this.checkindays()
	await $.wait(3000)
	await SendMsg(msg)
    }

    async user() {
        try {
	    const https = require('https')
	    //const data = JSON.stringify({})
	    const options = {
		hostname: 'koplus.icoke.cn',
		port: 443,
		path: '/cre-bff/wechat/profile',
		method: 'GET',
		headers: {
		    'Content-Type': 'application/json',
		    //'Content-Length': data.length,
		    'authorization': 'MP '+this.ck
		}
	    }
	    const req = https.request(options, res => {
		console.log(`\n状态码: ${res.statusCode}`)
		if (`${res.statusCode}` == 200) {
		    let str = ''
		    res.on('data', function (chunk) {
		    str += chunk
		    })
		    res.on('end', function(){
			let result = JSON.parse(str)
			console.log(result)
			console.log(`\n用户昵称：【${result.data.nickName}】`)
			let a = result.data.point / 10
			console.log(`\n现有可乐瓶：【${a}】`)
			console.log(`\n现有经验值：【${result.data.experience}】`)
			let b = result.data.expiredPoint / 10
			console.log(`\n过期可乐瓶：【${b}】`)
			msg += `\n用户昵称：【${result.data.nickName}】`
			msg += `\n现有可乐瓶：【${a}】`
			msg += `\n现有经验值：【${result.data.experience}】`
			msg += `\n过期可乐瓶：【${b}】`
		    })
		} else {
		    res.on('data', d => {
			let result = JSON.parse(d)
			console.log(result)
		        console.log(`\n积分查询：【${result.message}】`);
			msg += `\n积分查询：【${result.message}】`
		    })
		}
	    })
		
	    req.on('error', error => {
		console.error(error)
	    })

	    //req.write(data)
	    req.end()
		
        } catch (e) {
            console.log(e);
        }
    }

    async coupon() {
        try {
	    const https = require('https')
	    //const data = JSON.stringify({})
	    const options = {
		hostname: 'koplus.icoke.cn',
		port: 443,
		path: '/cre-bff/wechat/my-benefits/count',
		method: 'GET',
		headers: {
		    'Content-Type': 'application/json',
		    //'Content-Length': data.length,
		    'authorization': 'MP '+this.ck
		}
	    }
	    const req = https.request(options, res => {
		console.log(`\n状态码: ${res.statusCode}`)
		if (`${res.statusCode}` == 200) {
		    let str = ''
		    res.on('data', function (chunk) {
		    str += chunk
		    })
		    res.on('end', function(){
			let result = JSON.parse(str)
			console.log(result)
			console.log(`\n现有优惠券：【${result.data}】`)
			msg += `\n现有优惠券：【${result.data}】`
		    })
		} else {
		    res.on('data', d => {
			let result = JSON.parse(d)
			console.log(result)
		        console.log(`\n优惠券查询：【${result.errmsg}】`);
			msg += `\n优惠券查询：【${result.errmsg}】`
		    })
		}
	    })
		
	    req.on('error', error => {
		console.error(error)
	    })

	    //req.write(data)
	    req.end()
		
        } catch (e) {
            console.log(e);
        }
    }

    async checkin() {
        try {
	    const https = require('https')
	    const data = JSON.stringify({})
	    const options = {
		hostname: 'koplus.icoke.cn',
		port: 443,
		path: '/cre-bff/wechat/checkin',
		method: 'POST',
		headers: {
		    'Content-Type': 'application/json',
		    'Content-Length': data.length,
		    'authorization': 'MP '+this.ck
		}
	    }
	    const req = https.request(options, res => {
		console.log(`\n状态码: ${res.statusCode}`)
		if (`${res.statusCode}` == 200) {
		    let str = ''
		    res.on('data', function (chunk) {
		    str += chunk
		    })
		    res.on('end', function(){
			let result = JSON.parse(str)
			console.log(result)
			let a = result.meta.transactionPoint /10
			console.log(`\n签到可乐瓶：【${a}】`)
			console.log(`\n可乐瓶延迟：【${result.meta.transactionDelayInDays}】天`)
			console.log(`\n签到的错误：【${result.meta.errorCode}】`)
			msg += `\n签到可乐瓶：【${a}】`
			msg += `\n可乐瓶延迟：【${result.meta.transactionDelayInDays}】天`
			msg += `\n签到的错误：【${result.meta.errorCode}】`
		    })
		} else {
		    res.on('data', d => {
			let result = JSON.parse(d)
			console.log(result)
		        console.log(`\n签到结果：【${result.message}】`);
			msg += `\n签到结果：【${result.message}】`
		    })
		}
	    })
		
	    req.on('error', error => {
		console.error(error)
	    })

	    req.write(data)
	    req.end()

        } catch (e) {
            console.log(e);
        }
    }

    async checkindays() {
        try {
	    const https = require('https')
	    //const data = JSON.stringify({})
	    const options = {
		hostname: 'koplus.icoke.cn',
		port: 443,
		path: '/cre-bff/wechat/check-in/times',
		method: 'GET',
		headers: {
		    'Content-Type': 'application/json',
		    //'Content-Length': data.length,
		    'authorization': 'MP '+this.ck
		}
	    }
	    const req = https.request(options, res => {
		console.log(`\n状态码: ${res.statusCode}`)
		if (`${res.statusCode}` == 200) {
		    let str = ''
		    res.on('data', function (chunk) {
		    str += chunk
		    })
		    res.on('end', function(){
			let result = JSON.parse(str)
			console.log(result)
			console.log(`\n连续签到：【${result.data.consecutiveDays}】天`)
			msg += `\n连续签到：【${result.data.consecutiveDays}】天`
		        })
		} else {
		    res.on('data', d => {
			let result = JSON.parse(d)
			console.log(result)
		        console.log(`\n签到信息查询：【${result.message}】`);
			msg += `\n签到信息查询：【${result.message}】`
		    })
		}
	    })
		
	    req.on('error', error => {
		console.error(error)
	    })

	    //req.write(data)
	    req.end()
		
        } catch (e) {
            console.log(e);
        }
    }
}

async function start() {
    const tasks = userList.map(user => user.main());
    await Promise.all(tasks);

    /*let taskall = [];
    for (let user of userList) {
        if (user.ckStatus) {
            taskall.push(await user.main());
        }
    }
    await Promise.all(taskall);*/
}
    
!(async () => {
    if (!(await checkEnv())) return;
    if (userList.length > 0) {
        await start();
    }
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());

// ============================================发送消息============================================ \\
/**
 * 添加消息
 * @param str
 * @param is_log
 */
function addNotifyStr(str, is_log = true) {
    if (is_log) {
        log(`${accountTips}${str}\n`)
    }
    msg += `${accountTips}${str}\n`
}

async function SendMsg(message) {
    if (!message)
        return;

    if (Notify > 0) {
        if ($.isNode()) {
            var notify = require('./sendNotify');
            await notify.sendNotify($.name, message);
        } else {
            $.msg(message);
        }
    } else {
        log(message);
    }
}

    
//********************************************************
/**
 * 变量检查与处理
 * @returns
 */
async function checkEnv() {
    let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || "";
    if (userCookie) {
        let e = envSplitor[0];
        for (let o of envSplitor)
            if (userCookie.indexOf(o) > -1) {
                e = o;
                break;
            }
        for (let n of userCookie.split(e)) n && userList.push(new UserInfo(n));
    } else {
        console.log("未找到CK");
        return;
    }
    return console.log(`共找到${userList.length}个账号`), true; //true == !0
}

/////////////////////////////////////////////////////////////////////////////////////
function httpRequest(options) {
    if (!options["method"]) {
        return console.log(`请求方法不存在`);
    }
    if (!options["fn"]) {
        console.log(`函数名不存在`);
    }
    return new Promise((resolve) => {
        $[options.method](options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err);
                } else {
                    try {
                        data = JSON.parse(data);
                    } catch (error) { }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(data);
            }
        });
    });
}

function Env(t, e) {
  class s {
    constructor(t) {
      this.env = t
    }
    send(t, e = "GET") {
      t = "string" == typeof t ? {
        url: t
      } : t;
      let s = this.get;
      return "POST" === e && (s = this.post), new Promise((e, i) => {
        s.call(this, t, (t, s, r) => {
          t ? i(t) : e(s)
        })
      })
    }
    get(t) {
      return this.send.call(this.env, t)
    }
    post(t) {
      return this.send.call(this.env, t, "POST")
    }
  }
  return new class {
    constructor(t, e) {
      this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports
    }
    isQuanX() {
      return "undefined" != typeof $task
    }
    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon
    }
    isLoon() {
      return "undefined" != typeof $loon
    }
    toObj(t, e = null) {
      try {
        return JSON.parse(t)
      } catch {
        return e
      }
    }
    toStr(t, e = null) {
      try {
        return JSON.stringify(t)
      } catch {
        return e
      }
    }
    getjson(t, e) {
      let s = e;
      const i = this.getdata(t);
      if (i) try {
        s = JSON.parse(this.getdata(t))
      } catch {}
      return s
    }
    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e)
      } catch {
        return !1
      }
    }
    getScript(t) {
      return new Promise(e => {
        this.get({
          url: t
        }, (t, s, i) => e(i))
      })
    }
    runScript(t, e) {
      return new Promise(s => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
        const [o, h] = i.split("@"), a = {
          url: `http://${h}/v1/scripting/evaluate`,
          body: {
            script_text: t,
            mock_type: "cron",
            timeout: r
          },
          headers: {
            "X-Key": o,
            Accept: "*/*"
          }
        };
        this.post(a, (t, e, i) => s(i))
      }).catch(t => this.logErr(t))
    }
    loaddata() {
      if (!this.isNode()) return {}; {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e);
        if (!s && !i) return {}; {
          const i = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(i))
          } catch (t) {
            return {}
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e),
          r = JSON.stringify(this.data);
        s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
      }
    }
    lodash_get(t, e, s) {
      const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i)
        if (r = Object(r)[t], void 0 === r) return s;
      return r
    }
    lodash_set(t, e, s) {
      return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
    }
    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
        if (r) try {
          const t = JSON.parse(r);
          e = t ? this.lodash_get(t, i, "") : e
        } catch (t) {
          e = ""
        }
      }
      return e
    }
    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
        try {
          const e = JSON.parse(h);
          this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
        } catch (e) {
          const o = {};
          this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
        }
      } else s = this.setval(t, e);
      return s
    }
    getval(t) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
    }
    setval(t, e) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
    }
    initGotEnv(t) {
      this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
    }
    get(t, e = (() => {})) {
      t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
      })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
        hints: !1
      })), $task.fetch(t).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o)
      }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
        try {
          if (t.headers["set-cookie"]) {
            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
          }
        } catch (t) {
          this.logErr(t)
        }
      }).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o)
      }, t => {
        const {
          message: s,
          response: i
        } = t;
        e(s, i, i && i.body)
      }))
    }
    post(t, e = (() => {})) {
      if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.post(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
      });
      else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
        hints: !1
      })), $task.fetch(t).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o)
      }, t => e(t));
      else if (this.isNode()) {
        this.initGotEnv(t);
        const {
          url: s,
          ...i
        } = t;
        this.got.post(s, i).then(t => {
          const {
            statusCode: s,
            statusCode: i,
            headers: r,
            body: o
          } = t;
          e(null, {
            status: s,
            statusCode: i,
            headers: r,
            body: o
          }, o)
        }, t => {
          const {
            message: s,
            response: i
          } = t;
          e(s, i, i && i.body)
        })
      }
    }
    time(t) {
      let e = {
        "M+": (new Date).getMonth() + 1,
        "d+": (new Date).getDate(),
        "H+": (new Date).getHours(),
        "m+": (new Date).getMinutes(),
        "s+": (new Date).getSeconds(),
        "q+": Math.floor(((new Date).getMonth() + 3) / 3),
        S: (new Date).getMilliseconds()
      };
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
      return t
    }
    msg(e = t, s = "", i = "", r) {
      const o = t => {
        if (!t) return t;
        if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
          "open-url": t
        } : this.isSurge() ? {
          url: t
        } : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"],
              s = t.mediaUrl || t["media-url"];
            return {
              openUrl: e,
              mediaUrl: s
            }
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl,
              s = t["media-url"] || t.mediaUrl;
            return {
              "open-url": e,
              "media-url": s
            }
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return {
              url: e
            }
          }
        }
      };
      this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
      let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
      h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h)
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
    }
    logErr(t, e) {
      const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
    }
    wait(t) {
      return new Promise(e => setTimeout(e, t))
    }
    done(t = {}) {
      const e = (new Date).getTime(),
        s = (e - this.startTime) / 1e3;
      this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
    }
  }(t, e)
}
