<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session, params, fetch }) => {
		const { data, error } = await supabase
			.from<Collection>('collections')
			.select('*, collection_links (*)')
			.eq('id', params.id)
			.single();
		if (error) {
			console.log({ error });
		}

		const tags = await Promise.all(
			data.collection_links.map(async (cl) => {
				const res = await fetch('/api/og-tags', {
					method: 'post',
					body: JSON.stringify({ url: cl.url })
				});
				const ogTags: OGTags = await res.json();
				return ogTags;
			})
		);

		for (const cl of data.collection_links) {
			cl.ogTags = tags.find((t) => t.originalUrl === cl.url);
		}

		return {
			props: {
				collection: data
			}
		};
	};
</script>

<script lang="ts">
	import PageTitle from '$lib/components/PageTitle.svelte';
	import PreviewLink from '$lib/components/PreviewLink.svelte';
	import { supabase } from '$lib/supabase';
	import type { Collection, CollectionLink, OGTags } from '$lib/models';
	import Label from '$lib/components/Label.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import InputSubmit from '$lib/components/InputSubmit.svelte';
	import Fa from 'svelte-fa';
	import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

	export let collection: Collection;

	let formData: Partial<CollectionLink> = {
		collection_id: null,
		url: null,
		description: null
	};

	const addLink = async () => {
		const { data, error } = await supabase
			.from<CollectionLink>('collection_links')
			.insert([
				{
					collection_id: collection.id,
					url: formData.url,
					description: formData.description
				}
			])
			.single();

		if (error) {
			console.log(error);
		} else {
			const res = await fetch('/api/og-tags', {
				method: 'post',
				body: JSON.stringify({ url: formData.url })
			});
			const ogTags: OGTags = await res.json();
			data.ogTags = ogTags;
			collection.collection_links = [data, ...collection.collection_links];
		}
	};

	const removeLink = async (id: string) => {
		const { data, error } = await supabase
			.from<CollectionLink>('collection_links')
			.delete()
			.match({ id });
		if (error) {
			console.log(error);
		} else {
			collection.collection_links = collection.collection_links.filter((cl) => cl.id !== id);
		}
	};
</script>

<div class="max-w-2xl mx-auto flex flex-col">
	<PageTitle class="mb-4">{collection.name}</PageTitle>
	<form on:submit|preventDefault={addLink} class="form-control w-full mb-12">
		<div class="flex mb-2">
			<Label class="w-1/3">Url</Label>
			<InputText
				bind:value={formData.url}
				class="input-bordered w-full"
				name="url"
				placeholder="https://example.com/post/123"
			/>
		</div>
		<div class="flex mb-2">
			<Label class="w-1/3">Description (optional)</Label>
			<InputText
				bind:value={formData.description}
				class="input-bordered w-full"
				name="description"
				placeholder="Includes that thing I talked to Stevie about the other day"
			/>
		</div>

		<div class="flex items-center">
			<InputSubmit class="w-1/3 btn-primary" value="Add" />
		</div>
	</form>

	{#each collection.collection_links as link, i}
		<div class="flex">
			<div class="flex flex-col">
				<PreviewLink ogTags={{ ...link.ogTags, description: link.description }} class="flex-1 mb-2" />
				<div>
					<div class="badge badge-secondary">cake</div>
					<div class="badge badge-secondary">chocolate</div>
				</div>
			</div>
			<div class="dropdown dropdown-left flex-none">
				<button tabindex="0" class="btn btn-ghost m-1"><Fa icon={faEllipsisV} /></button>
				<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
					<li><button on:click={() => removeLink(link.id)}>Remove</button></li>
					<li><button>Edit</button></li>
				</ul>
			</div>
		</div>
		{#if i < collection.collection_links.length}
			<div class="divider my-2" />
		{/if}
	{/each}
</div>
