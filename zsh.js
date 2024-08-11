// 招商荟签到
/**
京洞察问卷通知
35 9 * * * zsh.js
*/

const $ = new Env("招商荟");
const zshCookie = process.env.zshCookie;

async function signIn() {
    const options = {
        url: 'https://activity-prd.saas.cmsk1979.com/api/marketing/campaign/v1/go',
        headers: {
            'Cookie': zshCookie
        }
    };
    const response = await $.http.get(options);
    if (response.statusCode === 200) {
        console.log("签到成功:", response.body);
        await notify("招商荟签到成功", response.body);
    } else {
        console.log("签到失败:", response.body);
        await notify("招商荟签到失败", response.body);
    }
}

async function notify(title, message) {
    const notify = require('./sendNotify');
    await notify.sendNotify(title, message);
}

(async () => {
    await signIn();
})();
