const Discord = require('discord.js');
const { Command } = require('../../Handler.js');
const main = require('../../index.js');

const snekfetch = require('snekfetch');
const baseURL = 'http://thecolorapi.com/id?hex=';
const dummyURL = 'https://dummyimage.com/500x500';
const regex = /^[0-9a-f]{3,6}$/i;

module.exports = class ColorCMD extends Command {

    constructor() {

        super({
            name: 'color',
            alias: ['colour'],
            group: 'Util',
            info: 'Displays a color from a HEX color code',
            usage: 'color <hex>'
        });

    }

    async run(client, message, args) {

        if (args.length !== 1) return message.channel.send(this.invalid);

        let color;
        args[0].startsWith('#') ? color = args[0].substring(1) : color = args[0];
        if (!regex.test(color)) return message.channel.send(this.invalid);

        const url = baseURL + encodeURIComponent(color);

        try {
            const result = await snekfetch.get(url);
            const parsed = JSON.parse(result.text);

            const embed = new Discord.RichEmbed()
                .setThumbnail(`https://dummyimage.com/500x500/${parsed.hex.clean}/${parsed.hex.clean}.png`)
                .setColor(parsed.hex.value)
                .addField('HEX', parsed.hex.value)
                .addField('RGB', parsed.rgb.value);
            if (parsed.name.exact_match_name) embed.setTitle(parsed.name.value);
            else if (parsed.name.value !== '') {
                const color = parsed.name.closest_named_hex.substring(1);
                embed.setFooter(`Closest named color: ${parsed.name.value} (${parsed.name.closest_named_hex})`, `${dummyURL}/${color}/${color}.png`);
            }
            return message.channel.send(embed);
        } catch (e) {
            return message.channel.send(`O.o An error occured: \`${e.message}\`! Please try again later!`);
        }

    }

    get invalid() {
        return `Invalid usage: \`${this.usage}\``;
    }

}
