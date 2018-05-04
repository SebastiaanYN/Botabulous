const Discord = require('discord.js');
const { Command } = require('../../Handler.js');
const main = require('../../index.js');

const { stripIndents } = require('common-tags');

module.exports = class PingCMD extends Command {

    constructor() {

        super({
            name: 'ping',
            alias: ['pong', 'ping-pong'],
            group: 'General',
            info: 'Check the ping of the bot',
            usage: 'ping'
        });

    }

    async run(client, message, args) {

        const msg = await message.channel.send('Pinging...');
        const ping = Math.round(msg.createdTimestamp - message.createdTimestamp);
        if (ping < 1) return msg.edit('Please try again...');
        else return msg.edit(stripIndents`
            🏓 P${'o'.repeat(Math.ceil(ping / 100))}ng: \`${ping}ms\`
            💓 Heartbeat: \`${Math.round(client.ping)}ms\`
        `);

    }

}
