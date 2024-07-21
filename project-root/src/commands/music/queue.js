const { SlashCommandBuilder } = require('discord.js');
const MusicPlayer = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Displays the current music queue'),
  async execute(interaction) {
    try {
      // Check if the music player exists and has a queue
      if (!MusicPlayer || !MusicPlayer._queue || MusicPlayer._queue.getLength() === 0) {
        await interaction.reply('The queue is empty.');
        return;
      }

      // Format the queue information
      const queueList = MusicPlayer._queue._queue.map((track, index) => `${index + 1}. ${track.title} by ${track.artist}`).join('\n');

      // Send the formatted queue information to the user
      await interaction.reply(`**Current Queue:**\n${queueList}`);
    } catch (error) {
      console.error('Error handling queue command:', error);
      await interaction.reply('An error occurred while displaying the queue.');
    }
  },
};