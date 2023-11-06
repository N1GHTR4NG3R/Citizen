const { Events } = require("discord.js");
const patchNotes = require("../updates/index.js");
const embGenerator = require("../Classes/embedGen.js");

// Declare empty object for checking.
let patchNote = {};

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(bot) {
		console.log(`🥳 ${bot.user.username} is online and ready to party 🎉`);

		// Post SC updates
		// Timer set to 5 seconds after the update script, to ensure values are read
		setInterval(() => {
			// Function to check if PatchNotes has updated, and if so, Post.
			function postifDiff(value) {
				if (value === patchNote) return;
				patchNote = value;

				// Get relevant channel
				const channel = bot.channels.cache.get("1160051462370492488");

				// Create the embed for the generator
				const embedGenerator = new embGenerator();
				const postUpdate = embedGenerator.postUpd(patchNote);
				channel.send({ embeds: [postUpdate] }).catch(console.error);
			}
			postifDiff(patchNotes.update);
		}, 155000);
	},
};
