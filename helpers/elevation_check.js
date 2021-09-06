const { Permissions } = require('discord.js');
const fs = require('fs');

async function isStaff(member) {
    return await member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
}

async function isElevated(member) {
    if (await isStaff(member)) {
        return true;
    } else {
        const json_mods = JSON.parse(fs.readFileSync("persistent/moderators.json"));
        for (const mod_role of json_mods.mods) {
            return await member.roles.cache.some(role => role.id === mod_role);
        }
    }
}

module.exports = {
    isStaff(member) {return isStaff(member)},
    isElevated(member) {return isElevated(member)}
}