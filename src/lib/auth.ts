import { goto } from '$app/navigation';
import * as cookie from 'cookie';
import { supabase } from '$lib/supabase';

const db = supabase;

export default db;

export const auth = db.auth;

export const signOut = async () => {
	await auth.signOut();
	await unsetAuthCookie();
	goto('/');
};

export const getCookie = (name, token?, extra?) => {
	const Blank = { path: '/', expires: new Date(0) };
	const DefaultOptions = {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 180, // default Max-Age, can be overwritten via extra
	};
	let options = { ...DefaultOptions, ...extra };

	return token ? cookie.serialize(name, token, options) : cookie.serialize(name, '', Blank);
};

export const blankCookies = () => {
	return [getCookie('refresh_token', null), getCookie('access_token', null), getCookie('expires_at', null)];
};

const setServerSession = async (event, session) => {
	console.log('Setting Server Session >>>', event, session);
	await fetch('/api/auth.json', {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		credentials: 'same-origin',
		body: JSON.stringify({ event, session }),
	});
};

export const setAuthCookie = async (session) => {
	await setServerSession('SIGNED_IN', session);
};
export const unsetAuthCookie = async () => {
	await setServerSession('SIGNED_OUT', null);
};