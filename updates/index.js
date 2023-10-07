import fetch from "node-fetch";
import fs from "fs";
import "dotenv/config";

// Test URLS
console.log(process.env.THREAD_URL);
console.log(process.env.PATCH_URL);

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

/**
 * THREAD_URL = https://robertsspaceindustries.com/api/spectrum/forum/channel/threads?:authority:=robertsspaceindustries.com&:path:=/api/spectrum/forum/channel/threads&:scheme:=https&Accept:=application/json&Content-Length:=61&Content-Type:=application/json&Cookie:=CookieConsent={stamp:%278Efc9nzOlp15UspTGwlEXwKhoNeaaOl9/H2+oPTod5WRrTLc1H27sA==%27%2Cnecessary:true%2Cpreferences:false%2Cstatistics:false%2Cmarketing:false%2Cmethod:%27explicit%27%2Cver:1%2Cutc:1695542994345%2Cregion:%27gb%27};_rsi_device=25r4uwdb8i2j0i8n9bn9rzi27z;_ga_XGSMCBZNFM=GS1.2.1695755824.1.1.1695755993.60.0.0;__stripe_mid=a2a6bf80-4723-49b5-9fd7-f70574e960303890f7;wsc_view_count=2;wsc_hide=true;_ga=GA1.2.434123746.1695755825;_ga_P8L4W58CSL=GS1.1.1696198770.1.1.1696199129.0.0.0;Rsi-XSRF=FO0cZQ%3AZ0Dxec9QzmfiRO4%2BmnnWVw%3AjwlseNtIvvMcVj6sA6%2Fx7w%3A1696396321201;Rsi-Token=a915717ea78c08c37d35bdeac8593a8d&Dnt:=1&Origin:=https://robertsspaceindustries.com&Referer:=https://robertsspaceindustries.com/spectrum/community/SC/forum/190048?page=1%26sort=hot
PATCH_URL = https://robertsspaceindustries.com/api/spectrum/forum/thread/nested?Accept=application/json&Accept-Encoding=gzip,deflate,br&Accept-Language=en-GB,en;q=0.9&Content-Length=90&Content-Type=application/json&Cookie=CookieConsent={stamp:%278Efc9nzOlp15UspTGwlEXwKhoNeaaOl9/H2+oPTod5WRrTLc1H27sA==%27%2Cnecessary:true%2Cpreferences:false%2Cstatistics:false%2Cmarketing:false%2Cmethod:%27explicit%27%2Cver:1%2Cutc:1695542994345%2Cregion:%27gb%27};Rsi-Token=9e1d5664cf84f9916021e9c3eb158c90;_rsi_device=25r4uwdb8i2j0i8n9bn9rzi27z;_ga_XGSMCBZNFM=GS1.2.1695755824.1.1.1695755993.60.0.0;__stripe_mid=a2a6bf80-4723-49b5-9fd7-f70574e960303890f7;wsc_view_count=2;wsc_hide=true;_ga=GA1.2.434123746.1695755825;_ga_P8L4W58CSL=GS1.1.1696198770.1.1.1696199129.0.0.0;Rsi-XSRF=bsUcZQ%3AgQGSuOb8x3tFMQKyX%2F25EQ%3AjwlseNtIvvMcVj6sA6%2Fx7w%3A1696386171328&Dnt=1&Origin=https://robertsspaceindustries.com&Referer=https://robertsspaceindustries.com/spectrum/community/SC/forum/190048/thread/alpha-3-21-0-ptu-8734135-patch-notes/6244050&=
DISC_TOKEN = MTE1OTM0MjU1MDY3NTYxOTg0MA.GhmGPr.pQpk1Dq7jurbob9ndBLzQ-kb-qOUAYQnPTl69U
BOT_ID = 1159342550675619840
GUILD_ID = 1159000644057837568
 */
