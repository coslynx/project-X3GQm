const { Client, Intents } = require('discord.js');
const { PREFIX } = require('./utils/constants');
const { log } = require('./utils/logging');
const MusicPlayer = require('./utils/musicPlayer');
const Queue = require('./utils/queue');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });

// Global variables for managing music playback
let queue = new Queue();
let musicPlayer = null;

client.on('ready', () => {
  log('info', `Logged in as ${client.user.tag}!`);
  client.user.setActivity(`${PREFIX}help`, { type: 'LISTENING' });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const commandName = interaction.commandName;

  if (commandName === 'play') {
    try {
      // Get the user's input
      const input = interaction.options.getString('query');

      // Validate the input
      if (!validateInput(input)) {
        await interaction.reply(
          'Invalid input. Please provide a valid YouTube URL, Spotify track ID, or SoundCloud track URL.'
        );
        return;
      }

      // Fetch music data based on the input
      const trackData = await fetchMusicData(input);

      // Create a track object
      const track = {
        title: trackData.title,
        artist: trackData.artist,
        url: trackData.url,
        thumbnail: trackData.thumbnail,
      };

      // Add the track to the queue
      queue.add(track);

      // Join the user's voice channel if not already joined
      if (!musicPlayer || !musicPlayer._connection) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
          await interaction.reply('You must be in a voice channel to play music.');
          return;
        }

        musicPlayer = new MusicPlayer(interaction.guild, voiceChannel, interaction.channel);
        await musicPlayer.joinVoiceChannel();
      }

      // Start playback if the queue is not empty
      if (queue.getLength() > 0 && !musicPlayer._dispatcher) {
        musicPlayer.play(queue.peek());
      }

      // Reply to the user
      await interaction.reply(`${track.title} by ${track.artist} added to the queue.`);
    } catch (error) {
      console.error('Error handling play command:', error);
      await interaction.reply('An error occurred while playing music. Please try again.');
    }
  } else if (commandName === 'skip') {
    try {
      // Skip to the next track
      musicPlayer.skipTrack();
      await interaction.reply('Skipping to the next track.');
    } catch (error) {
      console.error('Error handling skip command:', error);
      await interaction.reply('An error occurred while skipping the track.');
    }
  } else if (commandName === 'stop') {
    try {
      // Stop the current track and clear the queue
      musicPlayer.stop();
      queue = new Queue();
      await interaction.reply('Stopped playing music.');
    } catch (error) {
      console.error('Error handling stop command:', error);
      await interaction.reply('An error occurred while stopping the music.');
    }
  } else if (commandName === 'queue') {
    try {
      // Display the current music queue
      const queueList = queue._queue.map((track, index) => `${index + 1}. ${track.title} by ${track.artist}`).join('\n');
      if (queueList) {
        await interaction.reply(`**Current Queue:**\n${queueList}`);
      } else {
        await interaction.reply('The queue is empty.');
      }
    } catch (error) {
      console.error('Error handling queue command:', error);
      await interaction.reply('An error occurred while displaying the queue.');
    }
  } else if (commandName === 'volume') {
    try {
      // Get the desired volume
      const volume = interaction.options.getInteger('volume');

      // Validate the volume input
      if (volume < 0 || volume > 100) {
        await interaction.reply('Invalid volume. Please enter a value between 0 and 100.');
        return;
      }

      // Set the volume
      musicPlayer.setVolume(volume);
      await interaction.reply(`Volume set to ${volume}%`);
    } catch (error) {
      console.error('Error handling volume command:', error);
      await interaction.reply('An error occurred while setting the volume.');
    }
  } else if (commandName === 'loop') {
    try {
      // Get the loop mode (song or queue)
      const loopMode = interaction.options.getString('mode');

      // Set the loop mode
      musicPlayer.setLoop(loopMode);
      await interaction.reply(`Loop mode set to ${loopMode}`);
    } catch (error) {
      console.error('Error handling loop command:', error);
      await interaction.reply('An error occurred while setting the loop mode.');
    }
  }
});

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

client.login(process.env.DISCORD_TOKEN);