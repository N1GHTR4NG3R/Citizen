const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Checks the bot -> server ping!."),

	async execute(interaction) {
		await interaction.reply({
			content: `Checking the ping...`,
			ephemeral: true,
		});
		await interaction.channel
			.send(`${interaction.user.username} checking your latency now...`)
			.then((msg) => {
				msg.edit(
					`${interaction.user.username} your ping is ${
						interaction.client.ws.ping
					}ms and your latency is: ${
						msg.createdTimestamp - interaction.createdTimestamp
					}ms`
				);
			});
	},
};
