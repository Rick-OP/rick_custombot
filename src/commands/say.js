const fs = require('fs');
const path = require('path'); 

async function sayCommand(interaction, isAdmin) {
  if (!isAdmin) {
    await interaction.reply({ content: "You're not an admin.", ephemeral: true });
    return;
  }

  const channelId = interaction.options.getString('channelid');

  if (!channelId) {
    await interaction.reply({ content: 'Channel ID is required.', ephemeral: true });
    return;
  }
  
  const tempChannelPath = path.join(__dirname, 'temp_channel.json');
  fs.writeFileSync(tempChannelPath, JSON.stringify({ channelId }), 'utf-8');
  await interaction.reply({ content: `Channel <#${channelId}> is selected. Now send the message you want the bot to say.`, ephemeral: true });
}

function readTempChannel() {
  const tempChannelPath = path.join(__dirname, 'temp_channel.json');
  if (fs.existsSync(tempChannelPath)) {
    const data = fs.readFileSync(tempChannelPath, 'utf-8');
    console.log('Reading from', tempChannelPath);
    return JSON.parse(data).channelId;
  }
  return null;
}

module.exports = { sayCommand, readTempChannel };
