const client = require('../../index');

const { Player, useMainPlayer, useQueue } = require('discord-player');
const { SpotifyExtractor ,SoundCloudExtractor } = require('@discord-player/extractor');
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('discord.js');

const player = new Player(client);
player.extractors.loadDefault();

client.on('messageCreate', async msg => {

    if (msg.content.includes('!play')) {
        try{
        const args = msg.content.split(' ');
        const query = args.slice(1).join(' ');
        const VoiceChannel = msg.member.voice.channel;
        const player = useMainPlayer();
        const searchResult = await player.search(query, {
            requestedBy: msg.user });
        const queue = player.nodes.create(msg.guild.id, {
            metadata: {
                track: searchResult.tracks[0],
                canal: msg.channel,
                membro: msg.member
            }
        });
        if (!queue.isPlaying()) {
            await queue.connect(VoiceChannel.id);
            await queue.play(searchResult, { requestedBy: msg.author.id })
        }
        else {
            await queue.addTrack(searchResult.tracks[0], { requestedBy: msg.author.id })
        }
    }catch(err){
        msg.reply('Ocorreu um erro ao tentar reproduzir a musica, tente novamente mais tarde')
        msg.channel.send({ content: '```' + err + '```' })
    }
    }
})



client.on('messageCreate', async msg => {
    if (msg.content == '!linha') {
        const queue = player.nodes.get(msg.guild.id);

        const progressBar = queue.node.createProgressBar(queue.metadata.canal, { timecodes: true, queue, length: 15, timecodeUpdateInterval: 4000 })

        queue.metadata.canal.send(progressBar).then(async msg => {
            msg.reply('.')
        })

        console.log('linha')
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


player.events.on('playerStart', async (queue, track) => {


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
            // { name: ' ', value: ' ', inline: true },
            { name: 'Autor:', value: '```fix\n' + `${track.author}` + '```', inline: true },
        )
    }
    

    const progressBar = queue.node.createProgressBar(queue.metadata.canal, { timecodes: true, queue, length: 15, timecodeUpdateInterval: 4000, indicator: ':purple_circle:'})
    

        embed.addFields(
            {value: progressBar, name: '⠀', inline: false },
        )

        const sendEmbed = queue.metadata.canal.send({ embeds: [embed] }).then(async msg => {
    
        const durationSeconds = parseInt(track.duration.split(':')[0]) * 60 + parseInt(track.duration.split(':')[1])
        const divisoes = (durationSeconds / 15)
        const tmp = divisoes * 1000
        console.log(`duracao: ${durationSeconds}\ndivisoes: ${divisoes}`)
  
        const ii = 0
  
        setInterval(() => {
            if (!queue.isPlaying()) return;
            if (ii == 15) return;
                ii++
                console.log(ii)
                msg.edit({ embeds: [embed.spliceFields(2,2, {value: queue.node.createProgressBar(queue.metadata.canal, { timecodes: true, queue, length: 15, timecodeUpdateInterval: 4000, indicator: ':purple_circle:'  }), name: '⠀', inline: false })] })
        }, tmp);   

    })     
    

    

    console.log(`Tocando: ${track.title}, de ${track.author}`);
})