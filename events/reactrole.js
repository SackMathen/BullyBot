const fs = require('fs');

class ReactRole {
    constructor() {
        console.log("PLUGIN: REACTROLE MODULE ENABLED")
    }
    async execute(reaction, user) {
        const json_roles = JSON.parse(fs.readFileSync("persistent/reactroles.json"));
        for (const element in json_roles.reactroles) {
            var reactrole = JSON.parse(json_roles.reactroles[element]);
            if (reaction.message.id == reactrole.message_id && reaction._emoji.name == reactrole.reaction_id) {
                let member = await reaction.message.guild.members.fetch(user.id);
                member.roles.add(`${reactrole.role_id}`);
            }
        }
    }
}

inst_reactrole = new ReactRole();
module.exports = inst_reactrole;