const RPC = require('discord-rpc');
const clientId = ''; 

RPC.register(clientId);

const rpc = new RPC.Client({ transport: 'ipc' });

let currentStatus = 'Idle';

rpc.on('ready', () => {
    console.log('RPC Started');
    updateActivity(); 
});

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

rpc.login({ clientId }).catch(console.error);
