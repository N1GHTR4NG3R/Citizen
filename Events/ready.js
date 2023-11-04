const { Events } = require("discord.js");
const patchNotes = require("../updates/index.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(bot) {
		console.log(`🥳 ${bot.user.username} is online and ready to party 🎉`);

		// Post SC updates
		// Timer set to same as the update script, However, may have a small difference between checking etc.
		setInterval(() => {
			console.log(patchNotes.update);
		}, 150000);
	},
};
