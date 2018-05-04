const Discord = require('discord.js');
const { Command } = require('../../Handler.js');
const main = require('../../index.js');

const { stripIndents } = require('common-tags');

const choices = new Map();
choices.set('sc', 'scissors');
choices.set('p', 'paper');
choices.set('r', 'rock');
choices.set('l', 'lizard');
choices.set('sp', 'spock');

const loser = new Map();
loser.set('scissors', ['paper', 'lizard']);
loser.set('paper', ['spock', 'rock']);
loser.set('rock', ['lizard', 'scissors']);
loser.set('lizard', ['spock', 'paper']);
loser.set('spock', ['scissors', 'rock']);

module.exports = class CRpsCMD extends Command {

    constructor() {

        super({
            name: 'crps',
            alias: ['complicatedrps', 'comprps'],
            group: 'Fun',
            info: stripIndents`
                This is a slightly more complicated version of the standard rock paper scissors game

                Below a list of possible choices, and what they beat
                ${Array.from(loser.keys()).map(key => `**${key}:** ${loser.get(key).join(', ')}`).join('\n')}
            `,
            usage: 'crps <scissors | paper | rock | lizard | spock>'
        });

    }

    run(client, message, args) {

        if (args.length === 0) return message.channel.send(this.invalid);
        
        let choice;
        if (args[0].startsWith('s')) choice = choices.get(args[0].substring(0, 2).toLowerCase());
        else choice = choices.get(args[0].charAt(0).toLowerCase());
        
        if (!choice) return message.channel.send(this.invalid);
        
        const botChoice = Array.from(choices.values())[Math.floor(Math.random() * choices.size)];
        
        if (choice === botChoice) return message.channel.send(this.tie(choice, botChoice));
        else if (loser.get(botChoice).includes(choice)) return message.channel.send(this.lose(choice, botChoice));
        else return message.channel.send(this.win(choice, botChoice));

    }
    
    tie(choice, botChoice) {
        return new Discord.RichEmbed()
            .setColor('#FF8300')
            .setTitle('CRPS')
            .setDescription(`${this.choice(choice, botChoice)} it's a tie!`);
    }
    
    win(choice, botChoice) {
        return new Discord.RichEmbed()
            .setColor('#32CD32')
            .setTitle('CRPS')
            .setDescription(`${this.choice(choice, botChoice)} you win!`);
    }
    
    lose(choice, botChoice) {
        return new Discord.RichEmbed()
            .setColor('#FF5555')
            .setTitle('CRPS')
            .setDescription(`${this.choice(choice, botChoice)} you lose!`);
    }
    
    choice(choice, botChoice) {
        return `You chose **${choice}** and I chose **${botChoice}**,`
    }
    
    get invalid() {
        return `Invalid usage: \`${this.usage}\``;
    }

}