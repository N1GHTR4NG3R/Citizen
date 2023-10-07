// Require Handlers
const fs = require("fs");
const path = require("path");

// Require relevant classes
const {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	Partials,
} = require("discord.js");

const dotenv = require("dotenv").config();

const token = process.env.DISC_TOKEN;

// Create new Client
const bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

bot.commands = new Collection();

// Create command Handler
const commandsPath = path.join(__dirname, "Commands");
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set new file in collection with key:value
	if ("data" in command && "execute" in command) {
		bot.commands.set(command.data.name, command);
	} else {
		console.error(
			`[WARNING] The command at ${filePath} is missing required "data" or "execute" property`
		);
	}
}

// Create Event Handler
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args));
	} else {
		bot.on(event.name, (...args) => event.execute(...args));
	}
}

bot.login(token);
