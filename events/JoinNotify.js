const Discord = require('discord.js');
const { Event } = require('../Handler.js');
const main = require('../index.js');

module.exports = class JoinNotify extends Event {
    
    constructor() {
        
        super({
            name: 'JoinNotify',
            event: 'joinNotify'
        });
        
    }
    
    run(client, message) {

        if (message.channel.name !== 'member-log') return;
        if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) return;
        return message.delete();

    }
    
}
