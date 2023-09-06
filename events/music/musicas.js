const client = require('../../index');
const { useQueue } = require('discord-player');

client.on('messageCreate', async msg => {
    if (msg.content == '!lista') {
        
        const queue = useQueue(msg.guild.id);
        const tracks = queue.tracks.toArray();!

        msg.reply(`${tracks}`)
    }
})