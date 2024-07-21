const { Client, Intents } = require('discord.js');
const { PREFIX, YOUTUBE_API_KEY, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SOUNDCLOUD_CLIENT_ID, SOUNDCLOUD_CLIENT_SECRET } = require('../utils/constants');
const { log } = require('../utils/logging');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  log('info', `Logged in as ${client.user.tag}!`);
  client.user.setActivity(`${PREFIX}help`, { type: 'LISTENING' });
});

client.login(process.env.DISCORD_TOKEN);