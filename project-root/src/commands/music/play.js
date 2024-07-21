const { SlashCommandBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const nodeFetch = require('node-fetch');
const MusicPlayer = require('../../utils/musicPlayer');
const Queue = require('../../utils/queue');
const { validateInput, fetchMusicData } = require('../../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays music from YouTube, Spotify, or SoundCloud')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('The music to play')
        .setRequired(true)
    ),
  async execute(interaction) {
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
  },
};