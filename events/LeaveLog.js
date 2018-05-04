const Discord = require('discord.js');
const { Event } = require('../Handler.js');
const main = require('../index.js');

module.exports = class LeaveLog extends Event {
    
    constructor() {
        
        super({
            name: 'LeaveLog',
            event: 'guildMemberRemove'
        });
        
    }
    
    run(client, member) {

        const logChannel = member.guild.channels.find(c => c.type === 'text' && c.name === 'member-log');
        if (!logChannel) return;
        if (!logChannel.permissionsFor(member.guild.me).has('SEND_MESSAGES')) return;
        const embed = new Discord.RichEmbed()
            .setColor('#FF7F00')
            .setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL)
            .setFooter('User left')
            .setTimestamp();
        return logChannel.send(embed);

    }
    
}
