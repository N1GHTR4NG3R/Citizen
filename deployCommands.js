// Require essentials
const { REST, Routes } = require("discord.js");

// Require environment
const dotenv = require("dotenv").config();

// Define environment variables
const token = process.env.DISC_TOKEN;
const botId = process.env.BOT_ID;
const guildId = process.env.GUILD_ID;
const fs = require("fs");
const path = require("path");

// Define an empty commands array to populate
const commands = [];
// Collect all commands from Commands folder
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));

// Grab the SlashCommandBuilder#toJSON() output of each commands data for deployment
for (const f of commandFiles) {
	const command = require(`./Commands/${f}`);
	// Push to empty commands array
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module, assigning to the bot via it's token
const rest = new REST({ version: "10" }).setToken(token);

// Deploy commands
(async () => {
	try {
		console.log(`Started updating ${commands.length} application commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(botId, guildId),
			{ body: commands }
		);

		console.log(`Successfully reloaded ${data.length} commands.`);
	} catch (error) {
		// Fallback to catch any potential errors
		console.error(error);
	}
})();
