const {Client, GatewayIntentBits, Partials} = require('discord.js')
const secret = require('./config.json')
const { Channel, Reaction, Message, GuildMember } = Partials
const { Guilds,  MessageContent, GuildMessages, GuildMembers, GuildVoiceStates, GuildMessageReactions, GuildPresences, DirectMessages} = GatewayIntentBits
const client = new Client({
  intents: [
    Guilds,
    MessageContent,
    DirectMessages,
    GuildMessages,
    GuildMembers,
    GuildVoiceStates,
    GuildMessageReactions,
    GuildPresences
  ], partials: [
    Channel,
    Reaction,
    Message,
    GuildMember
  ]})

module.exports = client

require('./handler/')(client)

client.login(secret.token)