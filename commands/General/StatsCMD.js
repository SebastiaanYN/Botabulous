const Discord = require('discord.js');
const { Command } = require('../../Handler.js');
const main = require('../../index.js');

module.exports = class StatsCMD extends Command {

    constructor() {

        super({
            name: 'stats',
            alias: ['statistics', 'performance'],
            group: 'General',
            info: 'Gives info about the bots performance',
            usage: 'stats'
        });

    }

    run(client, message, args) {
        
        const embed = new Discord.RichEmbed()
            .setColor(main.color())
            .addField('❯ Servers', client.guilds.size, true)
            .addField('❯ Users', client.guilds.map(g => g.memberCount).reduce((a, b) => a + b), true)
            .addField('❯ Channels', client.guilds.map(g => g.channels.size).reduce((a, b) => a + b), true)
            .addField('❯ Commands', main.getHandler('CH').commandsMap.size, true)
            .addField('❯ Commands Executed', main.commandsRan(), true)
            .addField('❯ Uptime', this.duration(client.uptime), true)
            .addField('❯ Shards', client.options.shardCount, true)
            .addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
            .addField('❯ Node Version', process.version, true);
        return message.channel.send(embed);

    }

    duration(ms) {
        const sec = Math.floor((ms / 1000) % 60).toString();
        const min = Math.floor((ms / (1000 * 60)) % 60).toString();
        const hrs = Math.floor(ms / (1000 * 60 * 60)).toString();
        return `${hrs.padStart(2, '0')}:${min.padStart(2, '0')}:${sec.padStart(2, '0')}`;
    }

}
