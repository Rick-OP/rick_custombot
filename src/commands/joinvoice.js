const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

async function joinVoiceCommand(interaction, isAdmin) {
  const { member, guild } = interaction;

  if (!isAdmin) {
    await interaction.reply({ content: "You're not an admin.", ephemeral: true });
    return;
  }

  if (!member.voice.channel) {
    await interaction.reply('You need to be in a voice channel to use this command.');
    return;
  }

  const channel = member.voice.channel;

  try {
    const existingConnection = getVoiceConnection(guild.id);
    if (existingConnection) {
      existingConnection.destroy();
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    await interaction.reply({ content:`Joined the voice channel: ${channel.name}`, ephemeral: true});
    console.log(`Joined the voice channel: ${channel.name}`);
  } catch (error) {
    console.error('Error joining voice channel:', error);
    await interaction.reply('An error occurred while trying to join the voice channel.');
  }
}

module.exports = { joinVoiceCommand };
