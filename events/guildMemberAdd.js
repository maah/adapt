const roleColors = require('../data/roleColors.json');


module.exports = {
    name: 'guildMemberAdd',
    async execute(guildMember) {
        if (guildMember?.guild.id != process.env.DISCORD_GUILD_ID)
            return;

        log(log_type.DISCORD, 'Member_Join: ' + guildMember?.user.tag);

        // Add custom role to member if they already have one
        const roleName = roleColors[guildMember.id];
        if (!roleName) return;

        const role = guildMember.guild?.roles.cache.find(r => r.name == roleName);
        if (!role) return;

        if (!guildMember.roles.cache.has(role.id))
            guildMember.roles.add(role);
    },
};