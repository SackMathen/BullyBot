const { Permissions } = require('discord.js');

function isMod(client, interaction) {
    if (isStaff(interaction)) {
        return true;
    } else {
         return client.db.get("moderationRoles").then(moderatorRoles => {
             for (let modRole of moderatorRoles) {
                if(interaction.member.roles.cache.has(modRole)) {
                    return true;
                }
             }
             return false;
        });
    }
}

function isStaff(interaction) {
    return interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
}

module.exports = {
    isMod(client, interaction) { return isMod(client, interaction)},
    isStaff(interaction) { return isStaff(interaction)},
}