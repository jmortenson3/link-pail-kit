<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		return {};
	};
</script>

<script lang="ts">
	import '../app.css';
	import { session } from '$app/stores';
	import { supabase } from '$lib/supabase';
	import { setAuthCookie, unsetAuthCookie } from '$lib/auth';

	console.log('session set?', $session.user);
	supabase.auth.onAuthStateChange(async (event, _session) => {
		if (event == 'SIGNED_IN') {
			await setAuthCookie(_session);
			session.set({ user: _session.user, authenticated: !!_session.user });
		}
		if (event == 'SIGNED_OUT') {
			await unsetAuthCookie();
			session.set({ user: undefined, authenticated: false });
		}
	});
</script>

<main><slot /></main>
