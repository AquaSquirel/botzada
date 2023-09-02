const client = require('../../index');

const { Player, useMainPlayer, useQueue } = require('discord-player');
const { SpotifyExtractor, SoundCloudExtractor } = require('@discord-player/extractor');
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('discord.js');

const player = new Player(client);
player.extractors.loadDefault();

client.on('messageCreate', async msg => {

    if (msg.content.includes('!play')) {
        const args = msg.content.split(' ');
        const query = args.slice(1).join(' ');
        const VoiceChannel = msg.member.voice.channel;
        const player = useMainPlayer();
        const searchResult = await player.search(query, { requestedBy: msg.user });
        const queue = player.nodes.create(msg.guild.id, {
            metadata: {
                track: searchResult.tracks[0],
                canal: msg.channel,
                membro: msg.member
            }
        });

        const searchResultAuthor = searchResult.tracks[0].author
        if (searchResultAuthor.includes('Jão')) {   
            
        }

        if (!queue.isPlaying()) {
            await queue.connect(VoiceChannel.id);
            await queue.play(searchResult, { requestedBy: msg.author.id })
        }
        else {
            await queue.addTrack(searchResult.tracks[0], { requestedBy: msg.author.id })
        }
    }
})

player.events.on('audioTrackAdd', (queue, track) => {
    if (!queue.isPlaying()) return;
    queue.metadata.canal.send({
        embeds: [
            new EmbedBuilder()
                .setTitle(`Adicionado a fila:   `)
                .setDescription(`[**${track.title}**](${track.url})\n⠀`)
                .setThumbnail(`${track.thumbnail}`)
                .setColor(Colors.Purple)
                .setFooter({ text: `Pedido por:  ${queue.metadata.membro.nickname}`, iconURL: `${queue.metadata.membro.user.displayAvatarURL({ dynamic: true })}` })
        ]
    });
    console.log(`Musica ${track.title} adicionada a lista de reprodução`);
});
player.events.on('playerStart', (queue, track) => {

    const embed = new EmbedBuilder()
        .setTitle(`Tocando agora:   `)
        .setDescription(`[**${track.title}**](${track.url})\n⠀`)
        .setThumbnail(`${track.thumbnail}`)
        .setColor(Colors.Purple)
        .setFooter({ text: `Pedido por:  ${queue.metadata.membro.nickname}`, iconURL: `${queue.metadata.membro.user.displayAvatarURL({ dynamic: true })}` })

    const vizu = track.views

    if (track.source !== 'spotify') {
        embed.addFields(
            { name: 'Duração:', value: '```apache\n' + `${track.duration}` + '```', inline: true },
            { name: 'Vizualizações:', value: '```apache\n' + `${vizu.toLocaleString('pt-BR')}` + '```', inline: true },
        )
    } else {
        embed.addFields(
            { name: 'Duração:', value: '```apache\n' + `${track.duration}` + '```', inline: true },
            { name: ' ', value: ' ', inline: true },
            { name: 'Autor:', value: '```fix\n' + `${track.author}` + '```', inline: true },
        )
    }

    queue.metadata.canal.send({ embeds: [embed] });
    console.log(`Tocando: ${track.title}, de ${track.author}`);
})