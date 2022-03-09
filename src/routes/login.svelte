<script lang="ts" context="module">
	export function load() {
		return {};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import SocialLoginButton from '$lib/components/SocialLoginButton.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import InputPassword from '$lib/components/InputPassword.svelte';
	import Label from '$lib/components/Label.svelte';
	import InputSubmit from '$lib/components/InputSubmit.svelte';

	let email: string = '';
	let password: string = '';

	let success = false;
	let isLoading = false;

	async function signInWithCredentials() {
		isLoading = true;
		const { user: _user, error } = await supabase.auth.signIn({ email, password });
		if (_user && !error) {
			success = true;
			goto('/app');
		} else {
			console.log(error);
			success = false;
		}

		isLoading = false;
	}

	async function signInWithProvider() {
		const { user: _user } = await supabase.auth.signIn({ provider: 'github' });
	}
</script>

<div class="max-w-sm mx-auto flex flex-col items-center">
	<PageTitle>Login</PageTitle>
	<form on:submit|preventDefault={signInWithCredentials} class="form-control w-full mb-12">
		<Label>Email</Label>
		<InputText
			bind:value={email}
			class="input-bordered w-full"
			name="email"
			placeholder="orville_tootinbacher@popcornfarts.com"
		/>

		<Label>Password</Label>
		<InputPassword
			bind:value={password}
			class="input-bordered w-full mb-4"
			name="email"
			placeholder="orville_tootinbacher@popcornfarts.com"
		/>
		<InputSubmit
			class="btn-primary btn-outline"
			value={isLoading ? 'spinning...' : success ? '👍' : 'Login!'}
		/>
	</form>

	<div class="divider w-full mb-12">OR</div>

	<form class="form-control" on:submit|preventDefault={signInWithProvider}>
		<SocialLoginButton class="mb-2" provider="github" />
		<SocialLoginButton class="mb-2" provider="google" />
	</form>
</div>
