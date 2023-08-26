const client = require('../index');
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('discord.js');

client.on('guildMemberAdd', member =>{  
    const channelId = '938625368837980220'; 
    const channel = client.channels.cache.get(channelId);
    const serverpic = member.guild.iconURL()
    const memberpic = member.user.avatarURL()

    const embed = new EmbedBuilder()
    .setTitle(`Seja bem vindo ao ${member.guild.name}, ${member.user.username}`)
    .setColor(Colors.Red)
    .setAuthor({iconURL: serverpic, name: `Novo membro!`})
    .setThumbnail(memberpic)

    channel.send({embeds: [embed], content: `||<@${member.user.id}>||`})
  })