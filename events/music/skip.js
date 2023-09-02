const client = require('../../index');
const { useMainPlayer } = require('discord-player');

client.on('messageCreate', async msg => {
    if (msg.content == '!skip') {
        const player = useMainPlayer();
        const queue = player.nodes.get(msg.guild.id);
        queue.node.skip();
    }
})