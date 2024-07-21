const { SlashCommandBuilder } = require('discord.js');
const MusicPlayer = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Loops the current song or the entire queue')
    .addStringOption((option) =>
      option
        .setName('mode')
        .setDescription('The loop mode (song or queue)')
        .addChoices(
          { name: 'Song', value: 'song' },
          { name: 'Queue', value: 'queue' }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      // Get the loop mode (song or queue)
      const loopMode = interaction.options.getString('mode');

      // Check if the music player is currently playing
      if (!MusicPlayer._dispatcher) {
        await interaction.reply('There is no song currently playing.');
        return;
      }

      // Set the loop mode
      MusicPlayer.setLoop(loopMode);
      await interaction.reply(`Loop mode set to ${loopMode}`);
    } catch (error) {
      console.error('Error handling loop command:', error);
      await interaction.reply('An error occurred while setting the loop mode.');
    }
  },
};