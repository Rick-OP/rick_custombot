const fs = require('fs');
const path = require('path');

const rolesFilePath = path.join(__dirname, '../roles.json');
function initializeRolesFile() {
    const initialRoles = [];
    if (!fs.existsSync(rolesFilePath)) {
        fs.writeFileSync(rolesFilePath, JSON.stringify(initialRoles, null, 2), 'utf-8');
    } else {
        try {
            const data = fs.readFileSync(rolesFilePath, 'utf-8');
            const roles = JSON.parse(data);
            if (!Array.isArray(roles)) {
                console.error(`Invalid format in roles.json: ${typeof roles}. Resetting to empty array.`);
                fs.writeFileSync(rolesFilePath, JSON.stringify(initialRoles, null, 2), 'utf-8');
            }
        } catch (error) {
            console.error('Error reading roles.json. Resetting to empty array.', error);
            fs.writeFileSync(rolesFilePath, JSON.stringify(initialRoles, null, 2), 'utf-8');
        }
    }
}

async function stickyRoleCommand(interaction, isAdmin) {
    if (!isAdmin) {
        await interaction.reply({ content: "You're not an admin.", ephemeral: true });
        return;
    }

    const action = interaction.options.getString('action');
    const roleId = interaction.options.getString('roleid');

    if (!action || !['add', 'remove', 'list'].includes(action)) {
        await interaction.reply({ content: 'Action must be "add", "remove", or "list".', ephemeral: true });
        return;
    }

    if ((action === 'add' || action === 'remove') && !roleId) {
        await interaction.reply({ content: 'Role ID is required for add and remove actions.', ephemeral: true });
        return;
    }

    if (action === 'add') {
        addRoleToStickyRoles(roleId);
        await interaction.reply({ content: `Role <@&${roleId}> has been added to sticky roles.`, ephemeral: true });
    } else if (action === 'remove') {
        removeRoleFromStickyRoles(roleId);
        await interaction.reply({ content: `Role <@&${roleId}> has been removed from sticky roles.`, ephemeral: true });
    } else if (action === 'list') {
        listStickyRoles(interaction);
    }
}

function listStickyRoles(interaction) {
    try {
        initializeRolesFile();

        let roles = [];
        if (fs.existsSync(rolesFilePath)) {
            const data = fs.readFileSync(rolesFilePath, 'utf-8');
            roles = JSON.parse(data);
            if (!Array.isArray(roles)) {
                console.error(`Unexpected format in roles.json: ${typeof roles}. Resetting.`);
                roles = [];
            }
        }

        if (roles.length === 0) {
            interaction.reply({ content: 'There are no sticky roles defined.', ephemeral: true });
        } else {
            const roleList = roles.map((roleId, index) => `${index + 1}. <@&${roleId}>`).join('\n');
            interaction.reply({ content: `Sticky Roles:\n${roleList}`, ephemeral: true });
        }
    } catch (error) {
        console.error('Error listing sticky roles:', error);
        interaction.reply({ content: 'Error listing sticky roles.', ephemeral: true });
    }
}

function addRoleToStickyRoles(roleId) {
    try {
        initializeRolesFile();

        let roles = [];
        if (fs.existsSync(rolesFilePath)) {
            const data = fs.readFileSync(rolesFilePath, 'utf-8');
            roles = JSON.parse(data);
            if (!Array.isArray(roles)) {
                console.error(`Unexpected format in roles.json: ${typeof roles}. Resetting.`);
                roles = [];
            }
        }

        if (!roles.includes(roleId)) {
            roles.push(roleId);
            fs.writeFileSync(rolesFilePath, JSON.stringify(roles, null, 2), 'utf-8');
            console.log(`Role ID ${roleId} added to roles.json`);
        } else {
            console.log(`Role ID ${roleId} is already in roles.json`);
        }
    } catch (error) {
        console.error('Error adding role to sticky roles:', error);
    }
}

function removeRoleFromStickyRoles(roleId) {
    try {
        initializeRolesFile();

        let roles = [];
        if (fs.existsSync(rolesFilePath)) {
            const data = fs.readFileSync(rolesFilePath, 'utf-8');
            roles = JSON.parse(data);
            if (!Array.isArray(roles)) {
                console.error(`Unexpected format in roles.json: ${typeof roles}. Resetting.`);
                roles = [];
            }
        }

        const index = roles.indexOf(roleId);
        if (index !== -1) {
            roles.splice(index, 1);
            fs.writeFileSync(rolesFilePath, JSON.stringify(roles, null, 2), 'utf-8');
            console.log(`Role ID ${roleId} removed from roles.json`);
        } else {
            console.log(`Role ID ${roleId} is not in roles.json`);
        }
    } catch (error) {
        console.error('Error removing role from sticky roles:', error);
    }
}

module.exports = { stickyRoleCommand };

