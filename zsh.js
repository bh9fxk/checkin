/*
 * @Author: renxia
 * @Date: 2024-02-23 13:52:46
 * @LastEditors: renxia
 * @LastEditTime: 2024-02-23 15:37:32
 *
 cron: 15 7 * * *
 new Env('招商荟签到')
 环境变量: zsh_ck， 多账户用 @ 或换行分割。抓取 https://youhui.95516.com/newsign/api 请求 headers 中 Authorization
 */

import { Env } from './utils';

const $ = new Env('云闪付签到', { sep: ['@', '\n'] });
$.init(signIn, 'zsh_ck').then(() => $.done());

async function signIn(auth: string) {
  const { data: result } = await $.req.post(
    'https://activity-prd.saas.cmsk1979.com/mactivity/2694396930360655872/sign-in',
    {},
    {
      Authorization: `Bearer ${auth.replace('Bearer ', '')}`,
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/6.8.0(0x16080000) NetType/WIFI MiniProgramEnv/Mac MacWechat/WMPF MacWechat/3.8.7(0x13080710) XWEB/1191'
    }
  );

  if ('signedIn' in result) {
    $.log(`今天是第${result['signInDays']['current']['days']}天签到 今日已签到成功,目前已连续签到${result['signInDays']['days']}天🎉`);
  } else {
    $.log(`用户查询:失败 ❌ 了呢,原因未知！`);
    console.log(result);
  }
}
