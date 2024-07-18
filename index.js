const mineflayer = require('mineflayer');
const readline = require('readline');
const RPC = require('discord-rpc');
const path = require('path');
const fs = require('fs');

const { clientId, server, username, password, auth, version } = require('./config.json');

RPC.register(clientId);

const rpc = new RPC.Client({ transport: 'ipc' });
let currentStatus = 'Idle';

rpc.on('ready', () => {
    console.log('RPC Started');
    updateActivity();
});

rpc.login({ clientId }).catch(console.error);

const bot = mineflayer.createBot({ host: server, username, password, auth, version });

bot.on('login', () => {
    console.log('Bot has logged in');
    updateStatus('Logged in');
    loadModules(bot);
});

bot.once('spawn', () => {
    console.log('Bot has spawned in the game');
    updateStatus('In the lobby');
});

bot.on('message', (message) => {
    console.log(message.toAnsi());
});

bot.on('error', (err) => {
    console.error(`An error occurred: ${err.message}`);
    updateStatus('Error occurred');
});

bot.on('kicked', (reason) => {
    console.log(`Kicked from the server: ${reason}`);
    updateStatus('Kicked from the server');
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    bot.chat(input);
});

function loadModules(bot) {
    const moduleDir = path.join(__dirname, 'modules');
    const moduleFiles = fs.readdirSync(moduleDir).filter(file => file.endsWith('.js'));

    moduleFiles.forEach(file => {
        const module = require(path.join(moduleDir, file));
        if (typeof module.init === 'function') {
            module.init(bot);
        }
    });
}

function updateActivity() {
    rpc.setActivity({
        details: currentStatus,
        startTimestamp: new Date(),
        largeImageKey: 'large',
        smallImageKey: 'small',
        smallImageText: 'Made with Mineflayer',
        instance: false,
        buttons: [
            { label: 'GitHub', url: 'https://github.com/koalabreeze1/InsanityCraft-Factions-Bot' }
        ]
    }).catch(console.error);
}

function updateStatus(newStatus) {
    currentStatus = newStatus;
    updateActivity();
}