const { Client, Intents } = require('discord.js');
const { log } = require('../utils/logging');
const MusicPlayer = require('../utils/musicPlayer');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });

// Global variable to store the music player instance
let musicPlayer = null;

client.on('voiceStateUpdate', (oldState, newState) => {
  // Check if the user has joined a voice channel
  if (newState.channel && !oldState.channel) {
    // Check if the bot is already in the same voice channel
    if (musicPlayer && musicPlayer._voiceChannel.id === newState.channel.id) {
      return; // Bot is already in the same channel, do nothing
    }

    // Join the user's voice channel if the bot is not already in it
    log('info', `${newState.member.user.tag} joined ${newState.channel.name}.`);
    musicPlayer = new MusicPlayer(newState.guild, newState.channel, newState.guild.channels.cache.find((channel) => channel.type === 'GUILD_TEXT'));
    musicPlayer.joinVoiceChannel();
  }

  // Check if the user has left a voice channel
  if (!newState.channel && oldState.channel) {
    // Check if the bot is in the same voice channel and there are no other users
    if (musicPlayer && musicPlayer._voiceChannel.id === oldState.channel.id && oldState.channel.members.size === 1) {
      // Disconnect the bot from the voice channel
      musicPlayer.stop();
      musicPlayer = null;
      log('info', `${oldState.member.user.tag} left ${oldState.channel.name}.`);
    }
  }
});

// Log in the bot with your bot token
client.login(process.env.DISCORD_TOKEN);