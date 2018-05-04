const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const colors = require('./json/colors.json');
const activities = require('./json/activity.json');


const {
  CommandHandler,
  EventHandler
} = require('./Handler.js');
const CH = new CommandHandler({
  folder: './commands/',
  prefix: ['=', '==', '+', '++']
});
const EH = new EventHandler({
  folder: './events/'
});
module.exports.getHandler = handler => {
  handler = handler.toLowerCase();
  if (handler === 'ch') return CH;
  else if (handler === 'eh') return EH;
  else return null;
}


let commandsRan = 0;
module.exports.commandsRan = () => commandsRan;
module.exports.color = () => colors.colors[Math.floor(Math.random() * colors.colors.length)];


client.on('ready', () => {
  console.log(`Logged in as: ${client.user.tag}`);

  setInterval(() => {
    const activity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(activity.text, {
      type: activity.type
    });
  }, 60 * 1000);

  const events = EH.events;
  for (const event of events.keys()) {
    client.on(event, (...parameters) => {
      try {
        EH.runEvent(event, client, ...parameters);
      } catch (e) {
        console.log(`An error occured trying to run event: ${event}`, e);
      }
    });
  }
});


client.on('message', message => {

  if (message.channel.type !== 'text') return;

  if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
  if (message.type === 'GUILD_MEMBER_JOIN') return client.emit('joinNotify', message);
  if (message.author.bot) return;

  let noPrefix = false;
  let isMention = 0;
  if (message.content.startsWith(client.user.toString())) {
    noPrefix = true;
    isMention++;
  }

  const messageArray = message.content.split(' ');
  const command = messageArray[0 + isMention];
  const args = messageArray.slice(1 + isMention);

  const cmd = CH.getCommand(command, noPrefix);
  if (!cmd) return;

  if (cmd.perms.length > 0 && message.author.id !== config.ownerID) {
    const permissions = [];
    const memberPerms = message.member.permissions.serialize();
    for (const perm in memberPerms) {
      if (memberPerms[perm]) permissions.push(perm);
    }
    if (!cmd.hasPermission(permissions)) return message.channel.send('You are missing permissions to run this command!');
  }

  try {
    cmd.run(client, message, args);
    commandsRan++;
  } catch (e) {
    console.log(`An error occured trying to run command: ${cmd.name}`, e);
    return message.channel.send(`An error occured trying to run command: \`${cmd.name}\``);
  }

});


client.login(config.token).catch(e => {
  console.log(e);
  process.exit();
});
