const { ActivityType } = require('discord.js');

const status = [
  {
    name: 'RICK-OP',
    type: ActivityType.Streaming,
    url: 'https://www.youtube.com/watch?v=g64artNVUWU',
  },
  {
    name: 'Rickx Server',
  },
  {
    name: 'Rickx Server',
    type: ActivityType.Watching,
  },
  {
    name: 'Rickx Server',
    type: ActivityType.Listening,
  },
];

let currentActivity = null;
let intervalId = null;

function setRandomActivity(client) {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 60000);
}

function setActivity(client, activity) {
  if (intervalId) clearInterval(intervalId);
  client.user.setActivity(activity);
}

module.exports = { setRandomActivity, setActivity, status, currentActivity };
