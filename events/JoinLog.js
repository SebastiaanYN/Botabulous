const Discord = require('discord.js');
const { Event } = require('../Handler.js');
const main = require('../index.js');

module.exports = class JoinLog extends Event {
    
    constructor() {
        
        super({
            name: 'JoinLog',
            event: 'guildMemberAdd'
        });
        
    }
    
    run(client, member) {

        const logChannel = member.guild.channels.find(c => c.type === 'text' && c.name === 'member-log');
        if (!logChannel) return;
        if (!logChannel.permissionsFor(member.guild.me).has('SEND_MESSAGES')) return;
        const embed = new Discord.RichEmbed()
            .setColor('#4FA83D')
            .setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL)
            .setFooter('User joined')
            .setTimestamp();
        return logChannel.send(embed);

    }
    
}
