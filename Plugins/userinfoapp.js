// Make sure you have the Admin Role variable set up in the bot configuration
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const momenttz = require('moment-timezone');
let message = context.params.event;
let sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};


let adminRoles = [`${process.env.ADMINROLE}`];
let adminRole = context.params.event.member.roles.find((roleId) => {
  return adminRoles.find((adminRoleId) => {
    return adminRoleId === roleId;
  });
});

///non admin
if (!adminRole) {
   let del = await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: context.params.event.channel_id,
      content: `<@${context.params.event.member.user.id}> You are not allowed to use this command`,
    });
    await sleep(8000);
    await lib.discord.channels['@0.1.2'].messages.destroy({
      message_id: del.id,
      channel_id: context.params.event.channel_id,
    });
    return;
  }
 
   ///for admin
let result = await lib.discord.guilds['@0.1.0'].members.retrieve({
  user_id: `${context.params.event.data.target_id}`,
  guild_id: `${process.env.GUILD_ID}`
});
let avatarUrl = result.user.avatar_url;

console.log(result)
if (avatarUrl) {
  let gifCheckResponse = await lib.http.request['@1.1.5']({
    method: 'GET',
    url: avatarUrl.replace('.png', '.gif')
  });
  if (gifCheckResponse.statusCode === 200) {
    avatarUrl = avatarUrl.replace('.png', '.gif');
  }
}
if (!result.user.avatar) {
  let discriminator = result.user.discriminator.split('');
  if (discriminator[3] === `0` || discriminator[3] === `5`) {
    avatarUrl = `https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png`;
  } else if (discriminator[3] === `1` || discriminator[3] === `6`) {
    avatarUrl = `https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png`;
  } else if (discriminator[3] === `2` || discriminator[3] === `7`) {
    avatarUrl = `https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png`;
  } else if (discriminator[3] === `3` || discriminator[3] === `8`) {
    avatarUrl = `https://discordapp.com/assets/0e291f67c9274a1abdddeb3fd919cbaa.png`;
  } else if (discriminator[3] === `4` || discriminator[3] === `9`) {
    avatarUrl = `https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png`;
  } 
}
console.log(result.roles)
let roles = '';
for (let i = 0; i < result.roles.length; i++) {
   roles = roles + `<@&${result.roles[i]}> `;
  }
  const DISCORD_EPOCH = 1420070400000;
  
  function convertSnowflakeToDate(snowflake) {
    return new Date(snowflake / 4194304 + DISCORD_EPOCH);
  }
  let timestamp1 = convertSnowflakeToDate(result.user.id)
  let date1 = Math.round((new Date(result.joined_at)).getTime() / 1000); 
  let timestamp = result.joined_at;
   let date = momenttz(timestamp);
   let joined_time = date.tz('Asia/Calcutta').format('dddd, MMMM DD,yyyy hh:mm:ss a z ');
await lib.discord.channels['@0.1.2'].messages.create({
  "channel_id": `${context.params.event.channel_id}`,
  "content": "",
  "tts": false,
  "embeds": [
    {
      "type": "rich",
      "title": "",
      "description": ` ${result.user.username} | <@${context.params.event.data.target_id}>`,
      "color": 0x383838,
      "fields": [
        {
          "name": `Nickname`,
          "value": result.nick ?? `No Nickname`,
        },
        {
          "name": `Server Joined `,
          "value": `<t:${date1}:R>`
        },
         {
          "name": "Registration date",
          "value": `<t:${Math.floor(timestamp1.getTime() / 1000)}:R>`
        },
        {
          "name": `Server Roles`,
          "value": roles ? roles : `No Roles`,
          "inline": true
        },
          ],
      "thumbnail": {
        "url": avatarUrl,
        "height": 0,
        "width": 0
      },
      "author": {
        "name": `${result.user.username}#${result.user.discriminator}`,
        "icon_url": avatarUrl
      },
      "footer": {
        "text": `ID: ${result.user.id}`
      }
    }
  ]
  });
