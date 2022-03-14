import type { Fetch } from '@supabase/supabase-js/dist/main/lib/types';
import * as cheerio from 'cheerio';
import type { OGTags } from '$lib/models';

export const getOGTagsFromUrl = async (url: string, fetch: Fetch): Promise<OGTags> => {
	const res = await fetch(url);
	const html = await res.text();
	const $ = cheerio.load(html);
	const ogTags: OGTags = {
		originalUrl: url,
		title:
			$('meta[property="og:title"]').attr('content') ||
			$('title').text() ||
			$('meta[name="title"]').attr('content'),
		type: $('meta[property="og:type"]').attr('content'),
		description:
			$('meta[property="og:description"]').attr('content') ||
			$('meta[name="description"]').attr('content'),
		url: $('meta[property="og:url"]').attr('content'),
		site_name: $('meta[property="og:site_name"]').attr('content'),
		image:
			$('meta[property="og:image"]').attr('content') ||
			$('meta[property="og:image:url"]').attr('content'),
		icon: $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href'),
		keywords:
			$('meta[property="og:keywords"]').attr('content') ||
			$('meta[name="keywords"]').attr('content')
	};
	return ogTags;
};
