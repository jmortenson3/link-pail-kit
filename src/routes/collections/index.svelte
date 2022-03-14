<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		if (!session.user?.id) {
			return {
				status: 301,
				redirect: '/login'
			}
		}

		const { data, error } = await supabase
			.from('collections')
			.select('*, user_collections!inner(*), collection_links_count:collection_links(count)')
			.eq('user_collections.user_id', session.user?.id)
			.eq('user_collections.is_owner', true)
			.eq('user_collections.can_edit', true);
		if (error) {
			console.log({ error });
		}

		return {
			props: {
				collections: data
			}
		};
	};
</script>

<script lang="ts">
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { supabase } from '$lib/supabase';
	import Label from '$lib/components/Label.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import type { Collection } from '$lib/models';
	import InputSubmit from '$lib/components/InputSubmit.svelte';

	export let collections: Collection[] = [];

	let formData = {
		collectionName: ''
	};

	let createCollection = async () => {
		const { data, error } = await supabase
			.from('collections')
			.insert([{ name: formData.collectionName }])
			.single();
		if (error) {
			console.log(error);
		} else {
			collections = [data, ...collections];
		}
	};
</script>

<div class="max-w-xl mx-auto flex flex-col items-center">
	<PageTitle class="mb-4">My collections</PageTitle>
	<form on:submit|preventDefault={createCollection} class="form-control w-3/4 mb-4">
		<div class="flex mb-2">
			<InputText
				bind:value={formData.collectionName}
				class="input-bordered w-full"
				name="name"
				placeholder="name"
			/>
			<InputSubmit value="Create" />
		</div>
	</form>

	{#each collections as collection}
		<a href="/collections/{collection.id}">
			<div class="card w-96 bg-base-100 shadow-md hover:shadow-xl mb-4">
				<div class="card-body flex flex-row items-baseline">
					<h2 class="card-title">
						{collection.name}
					</h2>
					<small>{collection.collection_links_count[0].count} links</small>
				</div>
			</div>
		</a>
	{/each}
</div>
