'use strict';

const vm = require('vm');
const { performance } = require('perf_hooks');
const util = require('util');

process.on('message', async ({ code, admin, timeout }) => {
    const response = await run(code, admin, timeout);
    process.send(response);
});

async function run(code, admin, timeout) {

    const start = performance.now();
    try {
        const context = createContext(admin);
        let { result, time } = await evaluate(code, context, timeout);
        result = inspect(result);
        return { result, time };
    } catch (err) {
        let result;
        try {
            result = err.stack.split('at evaluate')[0].trim();
        } catch (e) {
            result = `Error: I honestly don't know.`;
        }
        return { result, time: performance.now() - start };
    }

}

function createContext(admin) {

    const sandbox = new Object(null);
    sandbox.client = {
        token: 'NDMyNTYxNDY2NjIxNjg5ODU3.DavF7g.BnJQQkE7P6OYMWx9FdKFujnDu69',
        user: {
            id: '432253323345657866'
        }
    }
    if (admin) {
        sandbox.require = require;
        sandbox.module = module;
        sandbox.global = global;
    }
    const context = vm.createContext(sandbox, { origin: 'vm://' });
    return context;

}

async function evaluate(code, context, timeout) {

    const m = new vm.Module(code, { context, url: 'vm:eval' });
    await m.link(() => { throw new Error('no imports'); });
    m.instantiate();
    const start = performance.now();
    const { result } = await m.evaluate({ timeout });
    const end = performance.now();
    return { result, time: end - start }

}

function inspect(value) {

    try {
        return util.inspect(value, {
            customInspect: false,
            maxArrayLength: 20,
            compact: false
        });
    } catch (e) {
        return '';
    }

}
