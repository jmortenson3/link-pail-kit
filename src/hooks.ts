import { auth, getCookie, blankCookies } from '$lib/auth';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { supabase } from '$lib/supabase';

const ExpiryMargin = 1000;

// exchange the refresh token for an access token
async function refreshAccessToken(cookies) {
	const { data, error } = await auth.api.refreshAccessToken(cookies.refresh_token);
	if (error) {
		cookies.access_token = null;
		cookies.refresh_token = null;
		cookies.expires_at = null;
		throw error;
	}

	auth.setAuth(data.access_token); //needed so that server calls are authenticated

	cookies.access_token = data.access_token;
	cookies.refresh_token = data.refresh_token;
	cookies.expires_at = data.expires_at;

	return [
		getCookie('refresh_token', data.refresh_token, { maxAge: data.expires_in }),
		getCookie('access_token', data.access_token, { maxAge: data.expires_in }),
		getCookie('expires_at', data.expires_at, { maxAge: data.expires_in })
	];
}

export const handle = async ({ event, resolve }) => {
	let cookies = cookie.parse(event.request.headers.get('cookie') || '');
	let setCookies = [];

	if (cookies.access_token || cookies.refresh_token) {
		if (parseInt(cookies.expires_at) < Math.floor(Date.now() / 1000) + ExpiryMargin) {
			console.log('Access token expired. Refreshing...');
			try {
				setCookies = await refreshAccessToken(cookies);
			} catch (err) {
				console.log(err);
				setCookies = blankCookies();
			}
		}
		const jwtPayload = cookies.access_token ? jwt.decode(cookies.access_token) : false;
		console.log(JSON.stringify(jwtPayload, null, 2));
		event.locals.authenticated = !!jwtPayload;
		event.locals.user = jwtPayload;
		if (event.locals.user) {
			const { data, error } = await supabase
				.from('user_profiles')
				.select('*')
				.match({ id: event.locals.user.sub })
				.single();
			if (data) {
				event.locals.user.id = data.id
				event.locals.user.user_profile = data;
			}
		}
	}

	let response = await resolve(event);

	if (setCookies?.length > 0) {
		setCookies.forEach((cookie) => response.headers.append('set-cookie', cookie));
	}

	console.log(event.locals.user);

	return response;
};

export async function getSession(request) {
	const { user, authenticated } = request.locals;
	console.log({ user });
	return {
		user,
		authenticated
	};
}
