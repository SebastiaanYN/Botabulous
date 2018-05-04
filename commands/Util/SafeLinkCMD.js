const Discord = require('discord.js');
const { Command } = require('../../Handler.js');
const main = require('../../index.js');

const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');

module.exports = class SafeLinkCMD extends Command {

    constructor() {

        super({
            name: 'safelink',
            alias: ['sl', 'link', 'spoopy-link', 'link-check'],
            group: 'Util',
            info: 'Check whether or not a link is safe',
            usage: 'safelink <link>'
        });

    }

    async run(client, message, args) {

        if (args.length !== 1) return message.channel.send(this.invalid);

        if (message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) message.delete();

        const site = encodeURIComponent(args[0]);
        try {
            const result = await snekfetch.get(`https://spoopy.link/api/${site}`);

            return message.channel.send(stripIndents `
                ${result.body.safe ? 'This link is safe!' : 'This link is not safe!'}
                ${result.body.chain.map(url => `${url.safe ? `✅ <${url.url}>` : `❌ <${url.url}> (\`${url.reasons.join(', ')}\`)`}`).join('\n')}
                Deleting in 10 seconds
            `).then(msg => msg.delete(10 * 1000));
        } catch (e) {
            return message.channel.send(`O.o An error occured: \`${e.message}\`! Please try again later!`);
        }

    }

    get invalid() {
        return `Invalid usage: \`${this.usage}\``;
    }

}
