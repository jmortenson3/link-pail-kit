import { supabase } from '$lib/supabase';
import { toExpressRequest, toExpressResponse } from '$lib/expressify';

export async function handleAuth({ event, resolve }) {
	// Converts request to have `req.headers.cookie` on `req.cookies, as `getUserByCookie` expects parsed cookies on `req.cookies`
	const request: Request = event.request;
	const expressStyleRequest = await toExpressRequest(request);
	// console.log('cookies', JSON.stringify(expressStyleRequest.cookies, null, 2));
	const { user, error } = await supabase.auth.api.getUserByCookie(expressStyleRequest);
	if (error) {
		console.log(error);
	}
	console.log({ cookieUser: user });
	event.locals.token = expressStyleRequest.cookies['access_token'] || undefined;
	event.locals.user = user;

	if (user) {
		const { data, error } = await supabase
			.from('user_profiles')
			.select('*')
			.match({ id: user.id })
			.single();
		if (data) {
			event.locals.user.user_profile = data;
		}
	}

	// if we have a token, set the client to use it so we can make authorized requests to Supabase
	if (event.locals.token) {
		supabase.auth.setAuth(event.locals.token);
	}

	let response = await resolve(event);

	// // if auth request - set cookie in response headers
	// if (request.method == 'POST' && event.url.pathname === '/api/auth.json') {
	// 	const req = await toExpressRequest(request, request.body);
	// 	supabase.auth.api.setAuthCookie(req, toExpressResponse(response));
	// }

	return response;
}
