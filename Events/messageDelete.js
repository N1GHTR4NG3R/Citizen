const { Events } = require("discord.js");

module.exports = {
	name: Events.MessageDelete,
	once: false,
	async execute(message) {
		console.log(`Message deleted: ${message}`);
	},
};
