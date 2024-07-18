module.exports = {
    init: (bot) => {
        bot.on('chat', (username, message) => {
            if (message === 'ping') {
                bot.chat('pong');
            }
        });
    }
};