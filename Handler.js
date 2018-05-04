class Command {

    constructor(data = {}) {

        // Command name
        this.name = data.name;

        // Aliases
        if (!data.alias) data.alias = [];
        if (!Array.isArray(data.alias)) throw new TypeError('Aliases must be an array');
        this.alias = data.alias;

        // Command group
        this.group = data.group;

        // Store permissions
        if (!data.perms) data.perms = [];
        this.perms = data.perms;
        
        // Information
        this.info = data.info;
        this.usage = data.usage;

    }

    hasPermission(perms) {

        if (typeof perms === 'string') perms = [perms];
        if (!Array.isArray(perms)) perms = perms.toArray();

        if (!perms) throw new TypeError('Invalid User Permission Array');
        if (!this.perms) throw new TypeError('Invalid Command Permission Array');

        for (const p of this.perms) {
            if (!perms.includes(p)) return false;
        }

        return true;

    }

    /**
    *
    * Name
    * Alias
    * Group
    * Perms
    * Info
    * Usage
    *
    */

    run() {
        console.log(`Command '${this.name}' has no handler.`);
    }

}


/* ---------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------- */


class CommandHandler {

    constructor(data = {}) {

        if (!data.folder) throw new Error('No folder specified!');
        if (!data.folder.endsWith('/')) data.folder += '/';
        this.folder = data.folder;
        this.__loadFrom(data.folder);

        // Set Prefix
        if (!Array.isArray(data.prefix)) data.prefix = [data.prefix];
        data.prefix.sort((a, b) => a.length < b.length);
        this.prefix = data.prefix;

    }

    /* ------------------------------------------------------------------------------ */

    get commandsMap() {
        return this.commands;
    }

    get aliasesMap() {
        return this.aliases;
    }

    get getPrefix() {
        return this.prefix;
    }

    /* ------------------------------------------------------------------------------ */

    getCommand(string, noPrefix = false) {

        if (!string) return null;

        let prefix = '';
        if (!noPrefix) {
            let hasPrefix = false;
            for (const p of this.prefix) {
                if (string.startsWith(p)) {
                    prefix = p;
                    hasPrefix = true;
                    break;
                }
            }
            if (!hasPrefix) return null;
        }

        const command = string.substring(prefix.length);
        let cmd = this.commands.get(command);
        if (!cmd) {
            const alias = this.aliases.get(command);
            if (!alias) return null;
            cmd = this.commands.get(alias);
        }

        return cmd;

    }
    
    /* ------------------------------------------------------------------------------ */

    reloadCommands() {

        const folder = this.folder;

        const fs = require('fs');
        const files = fs.readdirSync(folder);
        files.filter(f => fs.statSync(folder + f).isDirectory())
            .forEach(nested => fs.readdirSync(folder + nested).forEach(f => files.push(nested + '/' + f)));
        const jsFiles = files.filter(f => f.endsWith('.js'));

        if (files.length <= 0) throw new Error('This error should never occur!');

        for (const f of jsFiles) {

            delete require.cache[require.resolve(folder + f)];

        }

        this.__loadFrom(folder);
    }

    /* ------------------------------------------------------------------------------ */

    __loadFrom(folder) {

        const commands = new Map();
        const aliases = new Map();

        const fs = require('fs');
        const files = fs.readdirSync(folder);
        files.filter(f => fs.statSync(folder + f).isDirectory())
            .forEach(nested => fs.readdirSync(folder + nested).forEach(f => files.push(nested + '/' + f)));
        const jsFiles = files.filter(f => f.endsWith('.js'));

        if (files.length <= 0) throw new Error('No commands to load!');
        const fileAmount = `${jsFiles.length}`;
        const repeatAmount = 25 + fileAmount.length;

        console.log('\n' + '='.repeat(repeatAmount));
        console.log('\x1b[33m' + '%s', `Found ${fileAmount} files to load!\n`);

        for (const f of jsFiles) {

            const file = require(folder + f);
            const cmd = new file();

            const name = cmd.name;
            commands.set(name, cmd);

            console.log(`Loading command: '${name}'`);

            for (const alias of cmd.alias) {
                aliases.set(alias, name);
            }
        }

        console.log('%s\x1b[0m', '\nDone loading commands!');
        console.log('='.repeat(repeatAmount) + '\n');

        this.commands = commands;
        this.aliases = aliases;

    }

}


/* ---------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------- */


/* ---------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------- */


class Event {

    constructor(data = {}) {

        // Name for the event
        this.name = data.name;

        // Event name for handler
        this.event = data.event;

    }

    /**
    *
    * Name
    * Event
    *
    */

    run() {

        console.log(`Command '${this.name}' has no handler.`);

    }

}


/* ---------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------- */


class EventHandler {

    constructor(data = {}) {

        if (!data.folder) throw new Error('No folder specified!');
        if (!data.folder.endsWith('/')) data.folder += '/';
        this.folder = data.folder;
        this.__loadFrom(data.folder);

    }
    
    /* ------------------------------------------------------------------------------ */
    
    reloadEvents() {

        const folder = this.folder;

        const fs = require('fs');
        const files = fs.readdirSync(folder);
        files.filter(f => fs.statSync(folder + f).isDirectory())
            .forEach(nested => fs.readdirSync(folder + nested).forEach(f => files.push(nested + '/' + f)));
        const jsFiles = files.filter(f => f.endsWith('.js'));

        if (files.length <= 0) throw new Error('This error should never occur!');

        for (const f of jsFiles) {

            delete require.cache[require.resolve(folder + f)];

        }

        this.__loadFrom(folder);
    }

    /* ------------------------------------------------------------------------------ */

    __loadFrom(folder) {

        const events = new Map();

        const fs = require('fs');
        const files = fs.readdirSync(folder);
        files.filter(f => fs.statSync(folder + f).isDirectory())
            .forEach(nested => fs.readdirSync(folder + nested).forEach(f => files.push(nested + '/' + f)));
        const jsFiles = files.filter(f => f.endsWith('.js'));

        if (files.length <= 0) throw new Error('No events to load!');
        const fileAmount = `${jsFiles.length}`;
        const repeatAmount = 25 + fileAmount.length;

        console.log('\n' + '='.repeat(repeatAmount));
        console.log('\x1b[32m' + '%s', `Found ${fileAmount} files to load!\n`);

        for (const f of jsFiles) {

            const file = require(folder + f);
            const cmd = new file();

            const name = cmd.name;
            const event = cmd.event;

            if (!events.has(event)) {
                events.set(event, [cmd]);
            } else {
                const e = events.get(event);
                e.push(cmd);
                events.set(event, e);
            }

            console.log(`Loading event: '${name}'`);
        }

        console.log('%s\x1b[0m', '\nDone loading events!');
        console.log('='.repeat(repeatAmount) + '\n');

        this.events = events;

    }

    runEvent(eventName, ...params) {

        const event = this.events.get(eventName);
        if (!event) throw new Error(`No event with the name ${eventName}`);

        for (const cmd of event) {

            cmd.run(...params);

        }

    }

}









module.exports = {
    Command,
    CommandHandler,

    Event,
    EventHandler
};




/*

Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"

*/
