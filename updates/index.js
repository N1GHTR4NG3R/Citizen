import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

/**
 * Polyfill to use __dirname from Path
 * As this script is using ESM Modules.
 */
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Have to resolve Path for .env
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Declare variable to test differences of slugs.
let lastSlug;

// Get threads
const threadUpdater = async () => {
	const body = { channel_id: "190048", page: 1, sort: "hot", label_id: null };

	const fetchUpdatesRequest = await fetch(process.env.THREAD_URL, {
		method: "POST",
		body: JSON.stringify(body),
		headers: { "Content-Type": "application/json" },
	});

	const updates = await fetchUpdatesRequest.json();

	// Get the slug from the first thread
	let slug = updates.data.threads[0].slug;

	// Function to check Slug value has changed - If so, Continue to get data.
	async function getPostIfNew(value) {
		if (value === lastSlug) return;

		lastSlug = value;

		const response = await fetch(process.env.PATCH_URL, {
			method: "POST",
			body: JSON.stringify({ slug: value }),
			headers: { "Content-Type": "application/json" },
		});

		const notes = await response.json();

		// Write the update to a JSON file if the status is correct!.
		if (response.status === 200) {
			fs.writeFileSync(
				"../Data/patchNote.json",
				JSON.stringify(notes, null, 4)
			);
			console.log(`Got the latest patch note!`);
		} else {
			console.error(`ERROR: ${response.status}`);
		}
	}

	getPostIfNew(slug);
};

// Set to run once every 2m 30s, Should run 576 times every 24hrs to reduce load, impact and avoid any performance issues to RSI's website.
// Based off the unofficial API, Which I presume gets the data the same way - There rate limits are capped at 1000 per 24hrs, so this should allow for server restarts etc...
setInterval(threadUpdater, 150000);
