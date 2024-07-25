require('dotenv').config();
const { Client, IntentsBitField, REST, Routes, PermissionsBitField } = require('discord.js');
const { setRandomActivity } = require('./functions/RandomActivity.js');
const { assignRolesCommand } = require('./commands/assignroles');
const { testCommand } = require('./commands/test');
const { joinVoiceCommand } = require('./commands/joinvoice'); 
const { activityCommand } = require('./commands/activity');
const { sayCommand } = require('./commands/say');
const { tempChannelPath } = require('./path');
const fs = require('fs');
const { stickyRoleCommand } = require('./commands/stickyroles');
const { onMemberRemove, onMemberAdd, onMemberUpdate } = require('./functions/stickyrole');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

const currentVersion = require('../package.json').version;
const repoUrl = 'https://api.github.com/repos/Rick-OP/rxCustomBot/releases/latest';
const GUILD_ID = process.env.GUILD;
console.log('GUILD ID from .env:', GUILD_ID);

async function checkForUpdates() {
  try {
      const response = await fetch(repoUrl);
      const data = await response.json();
      const latestVersion = data.tag_name.replace(/^v/, '');

      if (latestVersion !== currentVersion) {
          console.log(`A new update for your bot is available: ${latestVersion}`);
          console.log(`Current version: ${currentVersion}`);
          console.log(`New version: ${latestVersion}`);
          console.log(`Update options:`);
          console.log(`1. Run git clone ${data.zipball_url}`);
          console.log(`2. Manually update from ${repoUrl}`);
      } else {
          console.log('Your bot is up to date.');
      }
  } catch (error) {
      console.error('Error checking for updates:', error);
  }
}

client.on('ready', async (c) => {
  console.log(`? ${c.user.tag} is 🟢 online and running`);
  console.log(`Guild ID from .env: ${GUILD_ID}`);
  console.log(`Developed by: RICK-OP`);
  await checkForUpdates();

  setRandomActivity(client);

  const commands = [
    {
      name: 'assignroles',  
      description: 'Check all users and assign roles',
    },
    {
      name: 'test',  
      description: 'Just to test if the commands is working',
    },
    {
      name: 'joinvoice',  
      description: 'Make the bot join your voice channel',
    },
    {
      name: 'activity',  
      description: 'Set the bot\'s activity or revert to random activities',
      options: [
        {
          name: 'type',
          type: 3,
          description: 'The type of activity',
          required: true,
          choices: [
            { name: 'COMPETING', value: 'COMPETING' },
            { name: 'CUSTOM', value: 'CUSTOM' },
            { name: 'LISTENING', value: 'LISTENING' },
            { name: 'PLAYING', value: 'PLAYING' },
            { name: 'STREAMING', value: 'STREAMING' },
            { name: 'WATCHING', value: 'WATCHING' },
            { name: 'RANDOM', value: 'RANDOM' }
          ],
        },
        {
          name: 'name',
          type: 3,
          description: 'The name of the activity',
        },
        {
          name: 'url',
          type: 3, 
          description: 'The URL of the activity (required for STREAMING)',
        }
      ],
    },
    {
      name: 'say',
      description: 'Make the bot say something in a specified channel.',
      options: [
        {
          name: 'channelid',
          type: 3,
          description: 'The ID of the channel where the bot should say the message.',
          required: true,
        }, 
      ],
    },
    {
      name: 'stickyroles',
      description: 'Add or remove sticky roles.',
      options: [
          {
               name: 'action',
               type: 3,
               description: 'Action to perform (add/remove/list)',
               required: true,
               choices: [
                 { name: 'add', value: 'add' },
                 { name: 'remove', value: 'remove' },
                 { name: 'list', value: 'list' }
            ]
          },
          {
              name: 'roleid',
              type: 3,
              description: 'add/remove Role ID or see list',
              required: false
          }
      ]
    },
  ];  
  
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(client.user.id, GUILD_ID), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

function checkAdmin(member) {
  return member.permissions.has(PermissionsBitField.Flags.Administrator);
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, member } = interaction;
  const isAdmin = checkAdmin(member);
  console.log(`${member.user.tag} used command ${commandName} and is ${isAdmin ? 'an admin' : 'not an admin'}`);

  if (commandName === 'assignroles') {
    await assignRolesCommand(interaction, isAdmin);
  } else if (commandName === 'test') {
    await testCommand(interaction, isAdmin);
  } else if (commandName === 'joinvoice') {
    await joinVoiceCommand(interaction, isAdmin);
  } else if (commandName === 'activity') {
    await activityCommand(interaction, isAdmin, client);
  } else if (commandName === 'say') {
    await sayCommand(interaction, isAdmin);
  } else if (commandName === 'stickyroles') {
    await stickyRoleCommand(interaction, isAdmin);
  }  
});

client.on('voiceStateUpdate', (oldState, newState) => {
  const botId = client.user.id;

  if (oldState.member.id === botId || newState.member.id === botId) {
    const member = oldState.member || newState.member;

    if (!newState.channel) {
      console.log(`Bot was disconnected from ${oldState.channel.name}`);
    } else if (oldState.channel && oldState.channel.id !== newState.channel.id) {
      console.log(`Bot was moved from ${oldState.channel.name} to ${newState.channel.name}`);
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    if (fs.existsSync(tempChannelPath)) {
      const tempData = JSON.parse(fs.readFileSync(tempChannelPath, 'utf8'));
      const tempChannelId = tempData.channelId;
      
      if (tempChannelId) {
        console.log('Temp channel ID:', tempChannelId);
        const channel = await client.channels.fetch(tempChannelId);
        if (channel) {
          await channel.send(message.content);
          fs.writeFileSync(tempChannelPath, JSON.stringify({ channelId: null }));
          await message.reply({ content: `Message sent to <#${tempChannelId}>.`, ephemeral: true });
        } else {
          await message.reply({ content: 'Failed to send the message. Channel not found.', ephemeral: true });
        }
      }
    }
  } catch (error) {
    console.error('Error in messageCreate event:', error);
  }
});

client.on('guildMemberRemove', onMemberRemove);
client.on('guildMemberAdd', onMemberAdd);
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  await onMemberUpdate(oldMember, newMember);
  console.log(`guildMemberUpdate: Checked roles for user ${newMember.id}`); 
});


client.login(process.env.TOKEN);
