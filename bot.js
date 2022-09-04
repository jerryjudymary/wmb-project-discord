require("dotenv").config();
const { connection } = require("./db-config.js");
const moment = require('moment');
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // ping 테스트 커맨드

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  };

  // button 커맨드

  if (interaction.commandName === 'button') {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel(`Let's Verify!`)
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.com/api/oauth2/authorize?client_id=1014589127456473129&redirect_uri=http%3A%2F%2Flocalhost%3A53134&response_type=code&scope=identify')
      );

    await interaction.reply({ content: '아래 버튼을 눌러 인증을 해주세요.', components: [row] });
  };

  // give 커맨드

  if (interaction.commandName === 'give') {

    connection.promise().query(
      `SELECT user_awd FROM user_info WHERE user_id = '${interaction.user.id}'`
    )
      .then(async function (results) {
        const alreadyAwd = results[0][0].user_awd;

        if (alreadyAwd !== 0) {
          await interaction.reply(`${interaction.user} 님은 이미 정착금을 받으셨습니다. ${interaction.user.username} 님이 현재 보유한 금액은 ${alreadyAwd} AWD 입니다.`);
          return;
        };

        const min = 100;
        const max = 1000;
        const awd = Math.floor(Math.random() * (max-min)) + min;
        const rewardedTime = moment().format("YYYY-MM-DD HH:mm:ss");

        connection.query(
          `UPDATE user_info SET user_awd = ${awd}, rewarded_time = '${rewardedTime}' WHERE user_id = '${interaction.user.id}'`,
          function(err, results, fields) {
            if (err) throw err;
          }
        );
    
        await interaction.reply(
          `${interaction.user} 에게 초기정착금 ${awd} AWD를 보냈습니다. ${interaction.user.username} 이/가 현재 보유한 금액은 ${awd} AWD 입니다.`
        );
      })
      .catch(err => console.log('err', err))
  };

  // rewardInfo 커맨드
  // 대문자 사용 불가능으로 toLowerCase 적용.

  if (interaction.commandName.toLowerCase() === 'rewardinfo') {
    connection.promise().query(
      `SELECT user_awd FROM user_info WHERE user_id = '${interaction.user.id}'`
    )
      .then(async function (results) {
        const alreadyAwd = results[0][0].user_awd;
          await interaction.reply(`${interaction.user}의 리워드는 ${alreadyAwd} AWD 입니다.`);
          return;
      })
      .catch(err => console.log('err', err))
  };

  // rewardRankingList 커맨드
  // 대문자 사용 불가능으로 toLowerCase 적용.

  if (interaction.commandName.toLowerCase() === 'rewardrankinglist') {
    connection.promise().query(
      `SELECT user_name FROM user_info ORDER BY user_awd, rewarded_time DESC LIMIT 50`
    )
      .then(async function (results) {
        const queryNames = results[0];

        const rankingArray = queryNames.map((user, index) => 
          `${(index + 1).toString()}위 : ${user.user_name}`
        )

        const rankingString = rankingArray.toString();
        const rankingList = rankingString.replace(/,/gi,'\n');

        await interaction.reply(rankingList);
        return;
      })
      .catch(err => console.log('err', err))
  };

});

client.login(process.env.TOKEN);

// 역할 부여 모듈

const GUILD_ID = '1014586952604979240';
const ROLE_ID = '1014587079776272464';

async function addRole(userId) {
  const guild = client.guilds.cache.get(GUILD_ID);
  const role = guild.roles.cache.get(ROLE_ID);
  const member = await guild.members.fetch(userId);
  member.roles.add(role);
}

module.exports = { addRole };