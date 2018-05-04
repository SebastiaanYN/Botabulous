const Discord = require('discord.js');
const { Command } = require('../../Handler.js');
const main = require('../../index.js');
const { performance } = require('perf_hooks');

module.exports = class ReloadCMD extends Command {

    constructor() {

        super({
            name: 'reload',
            alias: ['rl'],
            group: 'General',
            perms: ['BOT_OWNER'],
            info: 'Reloads all commands and events',
            usage: 'reload'
        });

    }

    run(client, message, args) {

        const start = performance.now();
        
        const CH = main.getHandler('CH');
        const EH = main.getHandler('EH');

        try {
            CH.reloadCommands();
            EH.reloadEvents();
        } catch (e) {
            console.log('An error occured reloading the commands and events!', e);
            return message.channel.send('An unknown error occured.');
        }
        
        const end = performance.now();
        
        return message.channel.send(`Succesfully reloaded the commands and events in **${(end - start).toString().substring(0, 5)}**ms!`);
    }

}
