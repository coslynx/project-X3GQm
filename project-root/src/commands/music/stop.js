const { SlashCommandBuilder } = require('discord.js');
const MusicPlayer = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the current song and clears the queue'),
  async execute(interaction) {
    try {
      // Check if the music player is currently playing
      if (!MusicPlayer._dispatcher) {
        await interaction.reply('There is no song currently playing.');
        return;
      }

      // Stop the music and clear the queue
      MusicPlayer.stop();
      await interaction.reply('Stopped playing music.');
    } catch (error) {
      console.error('Error handling stop command:', error);
      await interaction.reply('An error occurred while stopping the music.');
    }
  },
};