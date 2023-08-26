const { EmbedBuilder } = require('@discordjs/builders');
const client = require('../index');
const { Colors, ButtonBuilder, ActionRowBuilder } = require('discord.js');

client.on('messageCreate', msg => {
    if (msg.content.includes('!ticket')) {
        msg.delete()

        if (!msg.member.permissions.has('Administrator')) return msg.reply('Você não tem permissão para isso!').then(msg => setTimeout(() => msg.delete(), 5000))

        const openButtonTicket = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Ticket')
                    .setStyle(2)
                    .setEmoji('🎫')
                    .setCustomId('openTicket')
            )

        const embedOpenTicket = new EmbedBuilder()
            .setTitle('Ticket')
            .setDescription('Clique no botão abaixo para abrir um ticket!')
            .setColor(Colors.Purple)

        msg.channel.send({ embeds: [embedOpenTicket], components: [openButtonTicket] })
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === 'closeTicket') {
            interaction.channel.delete()
        }
        if (interaction.customId === 'openTicket') {

            interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: 0,
                parent: interaction.channel.parentId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['ViewChannel']
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel', 'SendMessages', 'AddReactions', 'AttachFiles', 'EmbedLinks', 'UseExternalEmojis']
                    }
                ]
            }).then(channel => {

                const embed = new EmbedBuilder()
                    .setTitle('Ticket')
                    .setDescription('Clique no emoji abaixo para fechar o ticket!')
                    .setColor(Colors.Purple)
                    .setFooter({ text: `Ticket criado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }) })
                    .setTimestamp()

                const closeButtonTicket = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('Fechar Ticket')
                            .setStyle(4)
                            .setEmoji('🎫')
                            .setCustomId('closeTicket')
                    )
                channel.send({ embeds: [embed], content: `<@${interaction.user.id}>`, components: [closeButtonTicket] })

                interaction.reply(`Ticket criado com sucesso em <#${channel.id}>!`).then(msg => setTimeout(() => msg.delete(), 5000))
            })
        }
    }
})