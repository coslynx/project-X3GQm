const { SlashCommandBuilder } = require('discord.js');
const { PREFIX } = require('../utils/constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of available commands'),
  async execute(interaction) {
    try {
      const embed = {
        color: 0x0099ff,
        title: 'Music Bot Commands',
        fields: [
          {
            name: `${PREFIX}play <query>`,
            value: 'Plays music from YouTube, Spotify, or SoundCloud.',
            inline: false,
          },
          {
            name: `${PREFIX}skip`,
            value: 'Skips the current song.',
            inline: false,
          },
          {
            name: `${PREFIX}stop`,
            value: 'Stops the current song and clears the queue.',
            inline: false,
          },
          {
            name: `${PREFIX}queue`,
            value: 'Displays the current music queue.',
            inline: false,
          },
          {
            name: `${PREFIX}volume <volume>`,
            value: 'Sets the playback volume (0-100).',
            inline: false,
          },
          {
            name: `${PREFIX}loop <mode>`,
            value: 'Loops the current song or the entire queue (mode: song or queue).',
            inline: false,
          },
        ],
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error handling help command:', error);
      await interaction.reply('An error occurred while displaying the help information.');
    }
  },
};