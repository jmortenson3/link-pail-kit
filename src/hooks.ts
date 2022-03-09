import { handleAuth } from '$lib/handleAuth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => handleAuth({ event, resolve });

export async function getSession(event) {
	const { user, token } = event.locals;
	return {
		user,
		token
	};
}
