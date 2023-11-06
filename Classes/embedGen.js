const { EmbedBuilder } = require("discord.js");

/**
 * @description
 * This file generates embeds for use elsewhere.
 * It's to keep code cleaner and easier to read across the board.
 *
 * All embeds should follow the following format:
 * Name: Name of Embed
 * Description: File of where it is for
 * Line number: Line number of file, in-case of multiple embeds.
 *
 * @param {string} bot references the bot
 * @param {string} header references the title of the embed
 * @param {string} date time and date input
 * @param {string} msgValue User inputted message
 */

class embedGen {
	postUpd(patchNote) {
		const updPost = new EmbedBuilder()
			.setColor(1146986)
			.setTitle(`${patchNote[1][1].text} PTU`)
			.setDescription(
				`### __Patch Details__ 
			🤖  \u00A0 ${patchNote[1][4].text}
			🤖  \u00A0 ${patchNote[1][5].text}
			🤖  \u00A0 ${patchNote[1][6].text}
			🤖  \u00A0 ${patchNote[1][7].text}
			🤖  \u00A0 ${patchNote[1][8].text}
			🤖  \u00A0 ${patchNote[1][9].text}
			
			** __${patchNote[1][10].text}__ **
			🤖  \u00A0 ${patchNote[1][11].text}
			🤖  \u00A0 ${patchNote[1][12].text}
			🤖  \u00A0 ${patchNote[1][13].text}
			🤖  \u00A0 ${patchNote[1][14].text}
			🤖  \u00A0 ${patchNote[1][15].text}
			
			**__${patchNote[2][1].text}__ **
			🤖  \u00A0 ${patchNote[2][3].text}
			🤖  \u00A0 ${patchNote[2][5].text}
			
			** __${patchNote[4][1].text}__ **
			🤖  \u00A0 ${patchNote[4][2].text}
			🤖  \u00A0 ${patchNote[4][3].text}
			🤖  \u00A0 ${patchNote[4][4].text}
			`
			)
			.setThumbnail(`${patchNote[0][2].text}`)
			.addFields({
				name: `${patchNote[1][2].text}`,
				value: `${patchNote[0][0].text}`,
			})
			.setTimestamp()
			.setFooter({ text: `This post was written by: ${patchNote[0][1].text}` });
		return updPost;
	}
}

module.exports = embedGen;
