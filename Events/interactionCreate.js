const { Events } = require("discord.js");

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		const command = interaction.client.commands.get(interaction.commandName);
		if (interaction.isChatInputCommand) {
			if (!command && !interaction.isButton()) {
				console.error(
					`No command matching ${interaction.commandName} was found!.`
				);
				return;
			}

			if (!interaction.isButton()) {
				try {
					await command.execute(interaction);
				} catch (error) {
					console.error(error);

					if (interaction.replied || interaction.deferred) {
						await interaction.followUp({
							content: `There was an error while executing ${interaction.commandName} follow up!`,
							ephemeral: true,
						});
					} else {
						await interaction.reply({
							content: `There was an error while executing ${interaction.commandName} reply!`,
						});
					}
				}
			}
		} else if (interaction.isButton()) {
			console.log(`Interaction registered!`);
		}
	},
};
