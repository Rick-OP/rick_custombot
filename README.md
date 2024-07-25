# rxCustomBot

**Developer:** RICK-OP

rxCustomBot is a versatile Discord bot designed to manage and provide various utility functions for your Discord server.

## Table of Contents

- [Installation](#installation)
- [Commands](#commands)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. **Clone repository or download sourcecode:**

    ```sh
    git clone https://github.com/Rick-OP/rxCustomBot.git
    cd rxCustomBot
    ```
    or just download the sourcecode an put it in the directory

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Set up your configuration:**

    Edit `.env` file in the root directory and add below information

    ```.env
        TOKEN:YOUR_BOT_TOKEN_HERE
        GUILD_ID:YOUR_GUILD_ID
    ```
> [!IMPORTANT]
> NO SPACES, NO UNWANTED SYMBOLS. JUST THE SAME FORMAT AS ABOVE

4. **Run the bot:**

    ```sh
    node index.js
    ```
## Commands

## Assignroles

This command is a complicated one. don't use this if you don't know how to use it.

### Here's what does it do

Go to `/src/commands/assignrole.js `
Edit 
```sh
const ROLE1_ID = 'ROLE_ID_HERE';
const ROLE2_ID = 'ROLE_ID_HERE';
```
Add Role 1 and Role 2 ID's to `ROLE_ID_HERE` part
After that use command
```sh
/assignroles
```
this will check roles of all users in a discord chat, 
then the logic is;
If user has `ROLE 1` then does nothing, if user missing `ROLE 1` then `ROLE 2` is added to the user. Bots are Ignored.
this is helpful for a big server with so many people has no roles, then this will automatically assign roles to those users. but not to users already has a different role.
> [!IMPORTANT]
> This will only work if you add the role to user after you made the role sticky.
> Only then the user ID will be saved to users.json
> Bot needs a higher role with admin previleges to do this. Needs to be place above ROLE 1 and ROLE 2

## Stickyroles

Manage sticky roles in your Discord server. Sticky roles are roles that are re-assigned to users when they leave and rejoin the server.
For example your server has a Ban/blacklisted role. it's easy for user to leave and join back to remove that role, just add the role to 
sticky roles. after from that point onwards, any new user added to that role will be saved. next time that user leaves and joins back, the 
role skicks right back to that user.

### Usage

- **Add a role to sticky roles:**

    ```
    /stickyroles add <roleid>
    ```

- **Remove a role from sticky roles:**

    ```
    /stickyroles remove <roleid>
    ```

- **List all sticky roles:**

    ```
    /stickyroles list
    ```
### If no sticky roles are found, the bot will inform you that there are no sticky roles currently set.

## Test
Just to test if the commands are working. And bot is running fine
```sh
/test
```

## Joining a Voice Channel
Bot will join the voice channel you're currently in
```sh
/joinvoice
```
It doesn't do anything, just shows the presence now. 
> planning to add play songs option in the future

## Setting a Custom Activity
```sh
Copy code
/activity type:PLAYING name:"Playing a cool game"
/activity type:STREAMING name:"Streaming some content" url:"https://www.youtube.com/watch?v=url"
/activity type:RANDOM
```
### Available activities are

COMPETING
CUSTOM
LISTENING
PLAYING
STREAMING
WATCHING
RANDOM 

### RANDOM

RANDOM options will play random pre set activities.
You can change it in `/src/functions/RandomActivity.js`

## Making the Bot Say
You can use `/say` to make the bot send message to a specific channel. 
> Bot needs to have send message access to that channel
say channel id first
```sh
/say channelid:123456789012345678"
```
Then bot will ask to send a message!
```
Hello World
```

### Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

### License
### This project is opensource
