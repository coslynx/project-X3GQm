const { SlashCommandBuilder } = require('discord.js');
const MusicPlayer = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song'),
  async execute(interaction) {
    try {
      // Check if the music player is currently playing
      if (!MusicPlayer._dispatcher) {
        await interaction.reply('There is no song currently playing.');
        return;
      }

      // Skip to the next track in the queue
      MusicPlayer.skipTrack();
      await interaction.reply('Skipping to the next track.');
    } catch (error) {
      console.error('Error handling skip command:', error);
      await interaction.reply('An error occurred while skipping the track.');
    }
  },
};