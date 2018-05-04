const Discord = require('discord.js');
const { Command } = require('../../Handler.js');
const main = require('../../index.js');

const regex = /(<#)?\d{18}(>)?/;

module.exports = class SayCMD extends Command {

    constructor() {

        super({
            name: 'say',
            group: 'General',
            perms: ['MANAGE_MESSAGES'],
            info: 'Repeats your message in chat, or sends it to a specific chat',
            usage: 'say [ID | mention] <message>'
        });

    }

    run(client, message, args) {

        if (args.length < 1) return message.channel.send(this.invalid);
        let current = true;
        let channel = message.channel;
        if (regex.test(args[0]) && !args[0].includes('@')) {
            current = false;
            channel = this.getChannel(args[0], message.guild);
            args.shift();
        }
        const msg = args.join(' ');
        if (!channel) return message.channel.send('Couldn\'t find this channel!');
        if (current && channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) message.delete();
        else if (message.channel.permissionsFor(message.guild.me).has('ADD_REACTIONS')) message.react('✅');
        
        const disableEveryone = message.channel.permissionsFor(message.member).has('MENTION_EVERYONE') ? false : true;
        return channel.send(msg, { disableEveryone });

    }
    
    get invalid() {
        return `Invalid usage: \`${this.usage}\``;
    }

    getChannel(id, guild) {
        return guild.channels.get(id.replace(/<#|>/g, ''));
    }
}
