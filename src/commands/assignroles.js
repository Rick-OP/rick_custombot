const { PermissionsBitField } = require('discord.js');

const ROLE1_ID = '1112456456456545645';
const ROLE2_ID = '1231231231231231231';

async function assignRolesCommand(interaction, isAdmin) {
  const { guild } = interaction;

  if (!isAdmin) {
    await interaction.reply({ content: "You're not an admin.", ephemeral: true });
    return;
  }

  await interaction.reply('Checking roles and assigning roles as needed...');
  
  const role1 = guild.roles.cache.get(ROLE1_ID);
  const role2 = guild.roles.cache.get(ROLE2_ID);

  if (!role1 || !role2) {
    await interaction.followUp('Roles not found.');
    return;
  }

  try {
    const members = await guild.members.fetch();
    for (const member of members.values()) {
      if (member.user.bot) {
        console.log(`${member.user.tag} is a bot and skipped.`);
        interaction.channel.send(`skipped ${member} is a bot`);
        continue;
      }
      
      if (!member.roles.cache.has(ROLE1_ID)) {
        await member.roles.add(ROLE2_ID);
        console.log(`Assigned ${role2.name} to ${member.user.tag}`);
        interaction.channel.send(`Assigned role ${role2} to ${member}`);
      }
    }
    await interaction.followUp('Role assignment complete.');
    console.log(`Role assignment complete.`);
  } catch (error) {
    console.error('Error assigning roles:', error);
    await interaction.followUp('An error occurred while assigning roles.');
  }
}

module.exports = { assignRolesCommand };
