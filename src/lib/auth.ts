import { supabase } from './supabase';
import { goto } from '$app/navigation';
import * as cookie from 'cookie';

export const signOut = async () => {
	await supabase.auth.signOut();
	await unsetAuthCookie();
	goto('/');
};

export const getCookie = (name, token, extra) => {
	const Blank = { path: '/', expires: new Date(0) };
	const DefaultOptions: cookie.CookieSerializeOptions = {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 180 // default Max-Age, can be overwritten via extra
	};
	let options = { ...DefaultOptions, ...extra };

	return token ? cookie.serialize(name, token, options) : cookie.serialize(name, '', Blank);
};

export const blankCookies = () => {
	return [
		getCookie('refresh_token', null, null),
		getCookie('access_token', null, null),
		getCookie('expires_at', null, null)
	];
};

const setServerSession = async (event, session) => {
	await fetch('/api/auth.json', {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		credentials: 'same-origin',
		body: JSON.stringify({ event, session })
	});
};

export const setAuthCookie = async (session) => {
	await setServerSession('SIGNED_IN', session);
};

export const unsetAuthCookie = async () => {
	await setServerSession('SIGNED_OUT', null);
};
