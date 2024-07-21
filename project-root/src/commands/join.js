const { SlashCommandBuilder } = require('discord.js');
const MusicPlayer = require('../../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Joins the user\'s voice channel'),
  async execute(interaction) {
    try {
      // Check if the user is in a voice channel
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        await interaction.reply('You must be in a voice channel to use this command.');
        return;
      }

      // Join the voice channel
      MusicPlayer = new MusicPlayer(interaction.guild, voiceChannel, interaction.channel);
      await MusicPlayer.joinVoiceChannel();
      await interaction.reply(`Joined ${voiceChannel.name}!`);
    } catch (error) {
      console.error('Error handling join command:', error);
      await interaction.reply('An error occurred while joining the voice channel.');
    }
  },
};