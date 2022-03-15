<script lang="ts" context="module">
	export function load() {
		return {};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import Fa from 'svelte-fa';
	import * as icons from '@fortawesome/free-solid-svg-icons';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import Label from '$lib/components/Label.svelte';
	import InputSubmit from '$lib/components/InputSubmit.svelte';
	import { session } from '$app/stores';


	let username: string = '';

	let success = false;
	let isLoading = false;

	async function setUsername() {
		isLoading = true;

		const { data, error } = await supabase
			.from('user_profiles')
			.update({ username })
			.match({ id: $session.user.id });

		console.log(data, error);

		success = !error;
		isLoading = false;
	}
</script>

<div class="max-w-sm mx-auto flex flex-col items-center">
	<PageTitle>Create a username!</PageTitle>
	<form on:submit|preventDefault={setUsername} class="form-control w-full mb-12">
		<Label>Email</Label>
		<InputText
			bind:value={username}
			class="input-bordered w-full"
			name="email"
			placeholder="orville_tootinbacher@popcornfarts.com"
		/>

		<InputSubmit
			class="btn-primary btn-outline"
			value={isLoading ? 'spinning...' : success ? '👍' : 'Login!'}
		/>
	</form>
</div>
