const path = require("node:path");
const dotenv = require("dotenv").config({
	path: path.resolve(__dirname, "..", ".env"),
});

// Declare variable to test differences of slugs.
let lastSlug;

// Declare empty variables to pass content into.
let updInfo = [];
let headers = [];
let sortHeaders = [];
let infoArr = [];
let firstCat = [];
let secondCat = [];
let thirdCat = [];
let fourthCat = [];
let fifthCat = [];
let sixCat = [];
let finArr = [];

// Declare empty variables to use.
let lastInd, current, next, last;

// Declare empty object for exporting:
let patchNotes = {};

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

		// Create URL for posting...
		const createUrl = `https://robertsspaceindustries.com/spectrum/community/SC/forum/190048/thread/${value}`;

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
				if (iter === 4) {
					fifthCat.push({ index: j, text: updInfo[j].text });
				}
				if (iter === 5) {
					sixCat.push({ index: j, text: updInfo[j].text });
				}
			}
			return { firstCat, secondCat, thirdCat, fourthCat, fifthCat, sixCat };
		};

		// Loop through each subHeaders array, and get the ranges
		sortHeaders.forEach((header, index) => {
			range(header.start, header.end, index);
		});

		// Build final array, by adding category text for easier sorting.
		infoArr.unshift(
			{ index: 0, text: createUrl },
			{ index: 1, text: notes.data.member.displayname },
			{ index: 2, text: notes.data.member.avatar }
		);
		firstCat.unshift({ index: 0, text: "Cat 1:" });
		secondCat.unshift({ index: 0, text: "Cat 2:" });
		thirdCat.unshift({ index: 0, text: "Cat 3:" });
		fourthCat.unshift({ index: 0, text: "Cat 4:" });
		fifthCat.unshift({ index: 0, text: "Cat 5:" });
		sixCat.unshift({ index: 0, text: "Cat 6:" });

		// Push all categories into one array
		finArr.push(
			infoArr,
			firstCat,
			secondCat,
			thirdCat,
			fourthCat,
			fifthCat,
			sixCat
		);
		return finArr;
	}
	await getPostIfNew(slug);
	return finArr;
};
// Set to run once every 2m 30s, Should run 576 times every 24hrs to reduce load, impact and avoid any performance issues to RSI's website.
// Based off the unofficial API, Which I presume gets the data the same way,
// there rate limits are capped at 1000 per 24hrs, so this should allow for server restarts etc...
setInterval(async () => {
	patchNotes.update = await threadUpdater();
}, 150000);

module.exports = patchNotes;
