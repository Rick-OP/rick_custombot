const { PermissionsBitField } = require('discord.js');

async function testCommand(interaction, isAdmin) {
  const { guild } = interaction;

  if (!isAdmin) {
    await interaction.reply({ content: "You're not an admin.", ephemeral: true });
    return;
  }

  await interaction.reply('Testing if commands working properly');
  try {
    await interaction.followUp('Testing Complete. No issues found.');
    console.log(`Testing Complete. No issues found.`);
  } catch (error) {
    console.error('Error test:', error);
    await interaction.followUp('An error occurred while .');
  }
}

module.exports = { testCommand };
