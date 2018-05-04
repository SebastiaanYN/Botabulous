const Discord = require('discord.js');
const { Command } = require('../../Handler.js');
const main = require('../../index.js');

module.exports = class PrefixCMD extends Command {

    constructor() {

        super({
            name: 'prefix',
            group: 'General',
            info: 'Shows all prefixes that the bot will respond to',
            usage: 'prefix'
        });

    }

    run(client, message, args) {

        const CH = main.getHandler('CH');
        const prefixes = CH.getPrefix.sort((a, b) => a.length > b.length).map(p => `\`${p}\``).join(', ');
        const prefix = prefixes.length === 1 ? 'prefix' : 'prefixes';
        return message.channel.send(`I will currently respond to the ${prefix}: ${prefixes}`);

    }

}
