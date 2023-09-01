const client = require('../index');

const { Player } = require('discord-player');
const { SpotifyExtractor, SoundCloudExtractor } = require('@discord-player/extractor');
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('discord.js');

const player = new Player(client);
player.extractors.loadDefault();


client.on('messageCreate', msg => {

    if(msg.content.includes('!play')) {

        const args = msg.content.split(' ');
        const query = args.slice(1).join(' ');

        const VoiceChannel = msg.member.voice.channel;

        player.play(VoiceChannel, query, {nodeOptions: {metadata: msg.channel}});
    }
})

player.events.on('playerStart', (queue, track) => {
    
    const embed = new EmbedBuilder()
    .setTitle(`${track.title}`)
    .setURL(`${track.url}`)
    .setImage(`${track.thumbnail}`)
    .setColor(Colors.Purple)

    const vizu = track.views

    if(track.source !== 'spotify') {
        embed.addFields(
        {name: 'Duração:', value: '```Fix ' + `${track.duration}` + '```', inline: true},
        {name: 'Vizualizações:', value: '```' + `${vizu}` + '```', inline: true},
        )
    } else {
        embed.addFields(
        {name: 'Duração:', value: '```' + `${track.duration}` + '```', inline: true},
        {name: ' ', value: ' ',inline: true},
        {name: ' ', value: ' ',inline: true},
        )
    }
        
    

    queue.metadata.send({embeds: [embed]});
    console.log(`Tocando: ${track.title}`);
})