const { SlashCommandBuilder } = require('discord.js');
const MusicPlayer = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Sets the playback volume')
    .addIntegerOption((option) =>
      option
        .setName('volume')
        .setDescription('The volume level (0-100)')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      // Get the desired volume
      const volume = interaction.options.getInteger('volume');

      // Validate the volume input
      if (volume < 0 || volume > 100) {
        await interaction.reply('Invalid volume. Please enter a value between 0 and 100.');
        return;
      }

      // Check if the music player is currently playing
      if (!MusicPlayer._dispatcher) {
        await interaction.reply('There is no song currently playing.');
        return;
      }

      // Set the volume
      MusicPlayer.setVolume(volume);
      await interaction.reply(`Volume set to ${volume}%`);
    } catch (error) {
      console.error('Error handling volume command:', error);
      await interaction.reply('An error occurred while setting the volume.');
    }
  },
};