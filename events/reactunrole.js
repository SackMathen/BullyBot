const fs = require('fs');

class ReactUnRole {
    constructor() {
        console.log("PLUGIN: REACTUNROLE MODULE ENABLED")
    }
    async execute(reaction, user) {
        const json_roles = JSON.parse(fs.readFileSync("persistent/reactroles.json"));
        for (const element in json_roles.reactroles) {
            var reactrole = JSON.parse(json_roles.reactroles[element]);
            if (reaction.message.id == reactrole.message_id && reaction._emoji.name == reactrole.reaction_id) {
                let member = await reaction.message.guild.members.fetch(user.id);
                member.roles.remove(`${reactrole.role_id}`);
            }
        }
    }
}

inst_reactunrole = new ReactUnRole();
module.exports = inst_reactunrole;
