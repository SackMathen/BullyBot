const client = require("../index");

client.on('messageReactionAdd', async(messageReaction, user) => {
    let reactroles = await client.db.get("reactionRoles");
    if (!reactroles || user.bot) return;

    for (let reactrole of reactroles) {
        if (messageReaction.message.id == reactrole.messageid && messageReaction.emoji.name) {
            const member = await messageReaction.message.guild.members.fetch(user.id);
            member.roles.add(reactrole.role);
        }
    }
});