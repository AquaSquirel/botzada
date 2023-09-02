const client = require('../../index');
const { useMainPlayer } = require('discord-player');

client.on('messageCreate', async msg => {
    if (msg.content.includes('!volume')) {
        const args = msg.content.split(' ');
        const volume = parseInt(args.slice(1).join(' '));

        const player = useMainPlayer();
        const queue = player.nodes.get(msg.guild.id);

        if (volume < 0 || volume > 100) return msg.reply('**O volume deve ser entre 0 e 100**').then(m => setTimeout(() => (m.delete(), msg.delete()), 5000));

        queue.node.setVolume(volume);

        msg.reply(`Volume alterado para **${volume}**`);
    }
})