const Discord = require('discord.js');
const { Command } = require('../../Handler.js');
const main = require('../../index.js');
const config = require('../../config.json');

const childProcess = require('child_process');
const snekfetch = require('snekfetch');
const codeBlock = /(^(```js|```))|(```$)/g;

module.exports = class EvalCMD extends Command {

    constructor() {

        super({
            name: 'eval',
            alias: ['evaluate', 'exec', 'execute'],
            group: 'Util',
            info: 'Evaluate JavaScript code',
            usage: 'eval <code>'
        });

    }

    async run(client, message, args) {

        let timeout = 1000;
        let admin = false;
        if (message.author.id === config.ownerID) {
            if (args[0].toLowerCase() === '-a') {
                args.shift();
                timeout *= 10;
                admin = true;
            }
        }
        let code = args.join(' ').trim();
        if (codeBlock.test(code)) code = code.replace(codeBlock, '').trim();

        try {
            const { result, time } = await this.evil(code, admin, timeout);

            const response = `${message.author} I executed your code in **${time.toString().substring(0, 9)}**ms \n\`\`\`js\n${result}\`\`\``;
            if (response.length >= 2000) {
                if (response.length >= 250000) return await message.channel.send(`${message.author} the output was longer than 250.000 characters, I\'m unable to do something with the output.`);
                const hasteKey = await snekfetch.post('https://hastebin.com/documents')
                    .send(result)
                    .then(r => r.body.key);
                await message.channel.send(`${message.author} the output was too long, I uploaded it to https://hastebin.com/${hasteKey}.js`);
            } else {
                await message.channel.send(response, { disableEveryone: true });
            }
        } catch (e) {
            console.log(e);
            await message.channel.send(`Wonky donky, something weird happened ${message.author}...`);
        }
        return;
    }

    evil(code, admin, timeout) {
        return new Promise((resolve, reject) => {

            const child = childProcess.fork('./eval/child.js', {
                silent: true,
                execArgv: [...process.execArgv, '--experimental-vm-modules']
            });
            child.send({ code, admin, timeout });
            child.once('message', response => {
                resolve(response);
            });
            child.once('error', err => {
                reject(err);
            });
            setTimeout(() => {
                child.kill();
                resolve({ result: 'Execution cancelled, took to long to complete!', time: 0 });
            }, timeout + 100);

        });
    }

}
