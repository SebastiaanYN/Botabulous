const Discord = require('discord.js');
const { Command } = require('../../Handler.js');
const main = require('../../index.js');

const choices = new Map();
choices.set('r', 'rock');
choices.set('p', 'paper');
choices.set('s', 'scissors');

const beater = new Map();
beater.set('rock', 'paper');
beater.set('paper', 'scissors');
beater.set('scissors', 'rock');

module.exports = class RpsCMD extends Command {

    constructor() {

        super({
            name: 'rps',
            alias: ['rockpaperscissors'],
            group: 'Fun',
            info: 'Play rock paper scissors against a bot',
            usage: 'rps <rock | paper | scissors>'
        });

    }

    run(client, message, args) {

        if (args.length === 0) return message.channel.send(this.invalid);
        
        const choice = choices.get(args[0].charAt(0).toLowerCase());
        if (!choice) return message.channel.send(this.invalid);
        
        const botChoice = Array.from(choices.values())[Math.floor(Math.random() * choices.size)];
        
        if (choice === botChoice) return message.channel.send(this.tie(choice, botChoice));
        else if (beater.get(botChoice) === choice) return message.channel.send(this.win(choice, botChoice));
        else return message.channel.send(this.lose(choice, botChoice));
        

    }
    
    tie(choice, botChoice) {
        return new Discord.RichEmbed()
            .setColor('#FF8300')
            .setTitle('RPS')
            .setDescription(`${this.choice(choice, botChoice)} it's a tie!`);
    }
    
    win(choice, botChoice) {
        return new Discord.RichEmbed()
            .setColor('#32CD32')
            .setTitle('RPS')
            .setDescription(`${this.choice(choice, botChoice)} you win!`);
    }
    
    lose(choice, botChoice) {
        return new Discord.RichEmbed()
            .setColor('#FF5555')
            .setTitle('RPS')
            .setDescription(`${this.choice(choice, botChoice)} you lose!`);
    }
    
    choice(choice, botChoice) {
        return `You chose **${choice}** and I chose **${botChoice}**,`
    }
    
    get invalid() {
        return `Invalid usage: \`${this.usage}\``;
    }

}
