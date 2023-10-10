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

// Declare empty variables to pass content into.
let updInfo = [];
let headers = [];
let sortHeaders = [];
let firstCat = [];
let secondCat = [];
let thirdCat = [];
let fourthCat = [];
let lastInd;
let current;
let next;
let last;

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

		const content = notes.data.content_blocks;

		// Loop first array
		for (let i = 0; i < content.length; i++) {
			// Assign objects from first array, to a second
			let dataInfo = content[i].data.blocks;
			// Loop second array
			for (let j = 0; j < dataInfo.length; j++) {
				// Filter out blank text formatting objects
				if (dataInfo[j].text !== "") {
					// assign remaining objects to another array
					updInfo.push({ ...dataInfo[j] });
				}
			}
			// Get the last index value.
			lastInd = updInfo.length;
		}

		// Loop new array of objects and select headers
		for (let k = 0; k < updInfo.length; k++) {
			if (updInfo[k].type === "header-one") {
				// Push headers index to array
				headers.push(k);
			}
		}
		// Push last index value to the end of headers array.
		headers.push(lastInd);

		// loop headers array, and format an array with start and end.
		headers.forEach((header, index) => {
			current = header;
			next = headers[index + 1];
			last = typeof next === "undefined";
			if (!last) {
				sortHeaders.push({ start: current, end: next });
			}
			return sortHeaders;
		});

		// Function to filter objects between arrays
		const range = (start, end, iter) => {
			// Loop from start to next calculated amount
			for (let j = start; j < end; j++) {
				if (iter === 0) {
					firstCat.push({ index: j, text: updInfo[j].text });
				}
				if (iter === 1) {
					secondCat.push({ index: j, text: updInfo[j].text });
				}
				if (iter === 2) {
					thirdCat.push({ index: j, text: updInfo[j].text });
				}
				if (iter === 3) {
					fourthCat.push({ index: j, text: updInfo[j].text });
				}
			}
			return { firstCat, secondCat, thirdCat, fourthCat };
		};

		// Loop through each subHeaders array, and get the ranges
		sortHeaders.forEach((header, index) => {
			range(header.start, header.end, index);
			console.log(header, index);
		});

		console.log({ firstCat, secondCat, thirdCat, fourthCat });
	}
	getPostIfNew(slug);
};

// Set to run once every 2m 30s, Should run 576 times every 24hrs to reduce load, impact and avoid any performance issues to RSI's website.
// Based off the unofficial API, Which I presume gets the data the same way,
// there rate limits are capped at 1000 per 24hrs, so this should allow for server restarts etc...
setInterval(threadUpdater, 150000);
