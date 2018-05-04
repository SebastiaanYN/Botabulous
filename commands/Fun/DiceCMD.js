const Discord = require('discord.js');
const { Command } = require('../../Handler.js');
const main = require('../../index.js');

module.exports = class DiceCMD extends Command {

    constructor() {

        super({
            name: 'dice',
            alias: ['roll', 'rolldice'],
            group: 'Fun',
            info: 'Roll a dice',
            usage: 'dice [amount]'
        });

    }

    run(client, message, args) {

        if (args.length === 0) return message.channel.send(`🎲 ${Math.floor(Math.random() * 6) + 1}`);
        
        const parsed = parseInt(args[0]);
        if (isNaN(parsed)) return message.channel.send('Please provide a valid number');
        if (parsed < 2 || parsed > 1000) return message.channel.send('Number must be between 2 and 1000!');
        
        const rolled = new Array(6).fill(0);
        
        for (let i = parsed; i > 0; i--) {
            const roll = Math.floor(Math.random() * 6);
            rolled[roll]++;
        }
        
        let i = 0;
        const embed = new Discord.RichEmbed()
            .setColor(main.color())
            .setTitle(`🎲 Rolled a dice ${parsed} times!`)
            .setDescription(rolled.map(num => `**${++i}:** ${rolled[i - 1]}`).join('\n'))
            .setFooter('Number Rolled: Times Rolled');
        message.channel.send(embed);
        
    }

}