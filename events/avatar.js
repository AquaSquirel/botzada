const { Colors } = require('discord.js');
const client = require('../index');
const { EmbedBuilder } = require('@discordjs/builders');

client.on('messageCreate', msg => {
    if (msg.content.includes('!avatar')) {

        const user = msg.mentions.users.first() || msg.author;

        const avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });

        const embed = new EmbedBuilder()
        .setTitle(`Avatar de ${user.username}`)
        .setColor(Colors.White)
        .setImage(`${avatar}`)

        msg.reply({ embeds: [embed] });
    }
 })