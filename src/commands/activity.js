const { ActivityType } = require('discord.js');
const { setActivity, setRandomActivity } = require('../functions/RandomActivity.js');

async function activityCommand(interaction, isAdmin, client) {
    if (!isAdmin) {
      await interaction.reply({ content: "You're not an admin.", ephemeral: true });
      return;
    }
  
    const type = interaction.options.getString('type');
    const name = interaction.options.getString('name');
    const url = interaction.options.getString('url');
  
    if (type === 'RANDOM') {
      setRandomActivity(client);
      await interaction.reply({ content: 'Reverted to random activities.', ephemeral: true });
      return;
    }
  
    let activity = { name };
  
    switch (type) {
      case 'COMPETING':
        activity.type = ActivityType.Competing;
        break;
      case 'CUSTOM':
        activity.type = ActivityType.Custom;
        break;
      case 'LISTENING':
        activity.type = ActivityType.Listening;
        break;
      case 'PLAYING':
        activity.type = ActivityType.Playing;
        break;
      case 'STREAMING':
        activity.type = ActivityType.Streaming;
        activity.url = url;
        if (!url) {
          await interaction.reply({ content: 'URL is required for streaming activity.', ephemeral: true });
          return;
        }
        break;
      case 'WATCHING':
        activity.type = ActivityType.Watching;
        break;
      default:
        await interaction.reply({ content: 'Invalid activity type.', ephemeral: true });
        return;
    }
  
    setActivity(client, activity);
    await interaction.reply({ content: `Activity set to ${type.toLowerCase()}: ${name}`, ephemeral: true });
  }
  

module.exports = { activityCommand };
