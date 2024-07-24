const fs = require('fs');
const path = require('path');

const rolesFilePath = path.join(__dirname, '../roles.json');
const usersFilePath = path.join(__dirname, '../users.json');

// Function to get sticky roles from roles.json
function getStickyRoles() {
    if (fs.existsSync(rolesFilePath)) {
        return JSON.parse(fs.readFileSync(rolesFilePath, 'utf-8'));
    }
    return [];
}

// Function to get user data from users.json
function getUserData() {
    if (fs.existsSync(usersFilePath)) {
        return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    }
    return {};
}

// Function to save user data to users.json
function saveUserData(userData) {
    fs.writeFileSync(usersFilePath, JSON.stringify(userData, null, 2), 'utf-8');
}

// Function to update user roles in users.json
function updateUser(userId, roleIds) {
    let userData = getUserData();
    userData[userId] = roleIds;
    saveUserData(userData);
}

// Event handler when a member leaves the server
async function onMemberRemove(member) {
    const stickyRoles = getStickyRoles();
    const userId = member.id;

    const memberRoles = member.roles.cache.filter(role => stickyRoles.includes(role.id)).map(role => role.id);

    if (memberRoles.length > 0) {
        updateUser(userId, memberRoles);
        console.log(`onMemberRemove: Roles for user ${userId} saved:`, memberRoles); 
    }
}

// Event handler when a member joins the server
async function onMemberAdd(member) {
    const userId = member.id;
    const userData = getUserData();

    if (userData[userId]) {
        const rolesToAdd = userData[userId];
        assignRoles(member, rolesToAdd);
        console.log(`onMemberAdd: Roles for user ${userId} assigned:`, rolesToAdd); // Log roles assigned to user
    }
}

// Event handler when a member's roles are updated
async function onMemberUpdate(oldMember, newMember) {
    const stickyRoles = getStickyRoles();
    const userId = newMember.id;

    const oldRoles = oldMember.roles.cache.filter(role => stickyRoles.includes(role.id)).map(role => role.id);
    const newRoles = newMember.roles.cache.filter(role => stickyRoles.includes(role.id)).map(role => role.id);

    // Roles added
    const addedRoles = newRoles.filter(roleId => !oldRoles.includes(roleId));
    if (addedRoles.length > 0) {
        let userData = getUserData();
        if (!userData[userId]) {
            userData[userId] = [];
        }
        userData[userId] = [...new Set([...userData[userId], ...addedRoles])]; // Ensure no duplicates
        saveUserData(userData);
        console.log(`Roles added to user ${userId}:`, addedRoles); // Log added roles
        console.log(`Updated user data for ${userId}:`, userData[userId]); // Log updated user data
    }

    // Roles removed
    const removedRoles = oldRoles.filter(roleId => !newRoles.includes(roleId));
    if (removedRoles.length > 0) {
        let userData = getUserData();
        if (userData[userId]) {
            userData[userId] = userData[userId].filter(roleId => !removedRoles.includes(roleId));
            saveUserData(userData);
            console.log(`Roles removed from user ${userId}:`, removedRoles); // Log removed roles
            console.log(`Updated user data for ${userId}:`, userData[userId]); // Log updated user data
        }
    }
}

// Function to assign roles to a user
function assignRoles(member, roleIds) {
    roleIds.forEach(roleId => {
        if (!member.roles.cache.has(roleId)) {
            member.roles.add(roleId).catch(console.error);
            console.log(`assignRoles: Role ${roleId} added to user ${member.id}`); // Log role assignment
        }
    });
}

module.exports = { onMemberRemove, onMemberAdd, onMemberUpdate };
