const Discord = require('discord.js');
const { Command } = require('../../Handler.js');
const main = require('../../index.js');

const { stripIndents } = require('common-tags');

module.exports = class HelpCMD extends Command {

    constructor() {

        super({
            name: 'help',
            alias: ['commands', 'manual'],
            group: 'General',
            info: stripIndents`
                    Show all the commands or info about a specific command
                    **[]** is optional
                    **<>** is required
            `,
            usage: 'help [command]'
        });

    }

    run(client, message, args) {

        if (args.length === 0) return this.general(message);
        else return this.specific(message, args);

    }

    general(message) {

        const CH = main.getHandler('CH');
        const CommandMap = CH.commandsMap;

        const category = new Map();
        for (const command of CommandMap) {
            const group = category.get(command[1].group);
            if (group) {
                group.push(command[1].name);
                category.set(command[1].group, group);
            } else {
                category.set(command[1].group, [command[0]]);
            }
        }

        const embed = new Discord.RichEmbed()
            .setColor(main.color())
            .setTitle('Commands')
            .setDescription('These are all commands! \nTo get specific info of a command use `help [command]`');

        for (const group of category) {
            const name = group[0];
            const value = group[1].map(name => `\`${name}\``).join(', ');
            embed.addField(name, value);
        }
        return message.channel.send(embed);

    }

    specific(message, args) {

        const CH = main.getHandler('CH');
        const cmd = CH.getCommand(args[0], true);
        if (!cmd) return message.channel.send(`No command found named \`${args[0]}\``);

        const embed = new Discord.RichEmbed()
            .setColor(main.color())
            .setTitle(this.capitalizeFirstLetter(args[0]))
            .setDescription(cmd.info);
        if (cmd.alias.length !== 0) embed.addField('Aliases', cmd.alias.map(alias => `\`${alias}\``).join(', '));
        if (cmd.perms.length > 0) embed.addField('Permissions', cmd.perms.map(perm => `\`${perm}\``).join(', '));
        embed.addField('Usage', cmd.usage)
            .setFooter('<> is required | [] is optional');
        return message.channel.send(embed);

    }
    
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.substring(1);
    }

}
