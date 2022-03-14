import type { RequestHandler } from '@sveltejs/kit';
import { getOGTagsFromUrl } from '$lib/linkUtils';
import OGTagsCache from '$lib/cache';

export const post: RequestHandler = async ({ request }) => {
	const json: { url: string } = await request.json();
	let ogTags = OGTagsCache.get(json.url);
	if (!ogTags) {
		ogTags = await getOGTagsFromUrl(json.url, fetch);
		OGTagsCache.add(ogTags);
	}

	return {
		status: 200,
		body: ogTags
	};
};
