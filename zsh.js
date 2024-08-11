// 招商荟签到脚本
const axios = require('axios');
const sendNotify = require('./sendNotify');

async function signIn() {
    try {
        const response = await axios.post('https://activity-prd.saas.cmsk1979.com/api/marketing/campaign/v1/go', {
            // 这里填写你的请求参数
            userId: '你的用户ID',
            token: '你的token'
        });

        if (response.data.success) {
            console.log('签到成功');
            await sendNotify('招商荟签到', '签到成功');
        } else {
            console.log('签到失败:', response.data.message);
            await sendNotify('招商荟签到', `签到失败: ${response.data.message}`);
        }
    } catch (error) {
        console.error('签到出错:', error);
        await sendNotify('招商荟签到', `签到出错: ${error.message}`);
    }
}

// 执行签到
signIn();
