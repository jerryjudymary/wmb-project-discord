const { REST, Routes } = require('discord.js');
require("dotenv").config();

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },

  {
    name: 'button',
    description: 'Click the button!',
  },
  {
    name: 'give',
    description: '/give 커맨드를 입력한 유저분께 정착금으로 100~1000 사이의 AWD를 드립니다!',
  },
  {
    name: 'rewardinfo', // 대문자 사용 불가능으로 봇 서버 코드에서 toLowerCase 적용. 
    description: '회원님의 보유 리워드 확인하기!',
  },
  {
    name: 'rewardrankinglist',
    description: '상위 50위까지 회원님들의 리워드 랭킹을 볼 수 있어요.',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands('1014589127456473129'), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();