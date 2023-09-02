const client = require('../../index');
const { useMainPlayer } = require('discord-player');
const { lyricsExtractor } = require('@discord-player/extractor');
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('discord.js');
client.on('messageCreate', async msg => {

    if (msg.content == '!letra') {
        const lyricsFinder = lyricsExtractor(/* 'optional genius API key' */);
        const player = useMainPlayer();
        const queue = player.nodes.get(msg.guild.id);
        const track = queue.metadata.track

        const lyrics = await lyricsFinder.search(track.title).catch(() => null);
        if (!lyrics) return interaction.followUp({ content: 'Letra não encontrada', ephemeral: true });

        const trimmedLyrics = lyrics.lyrics.substring(0, 1997);

        const embed = new EmbedBuilder()
            .setTitle(lyrics.title)
            .setURL(lyrics.url)
            .setThumbnail(lyrics.thumbnail)
            .setAuthor({
                name: lyrics.artist.name,
                iconURL: lyrics.artist.image,
                url: lyrics.artist.url
            })
            .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
            .setColor(Colors.Purple);

        msg.reply({ embeds: [embed] });
    }
})