<script lang="ts">
	import type { OGTags } from '$lib/models';
	import Fa from 'svelte-fa';
	import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

	export let ogTags: OGTags;
</script>

<a class={$$props.class} href={ogTags.originalUrl} target="_blank">
	<div class="flex bg-base-100 w-full min-h-16">
		<img
			src={ogTags.image}
			alt="Preview for link {ogTags.title}"
			class="flex-none object-cover w-16 h-16 rounded-lg mr-4"
		/>
		<div class="flex-1">
			<h2 class="pb-2 font-bold">
				{ogTags.title}
				<Fa icon={faArrowUpRightFromSquare} class="inline-block" />
			</h2>
			{#if ogTags.description}
				<p class="text-sm pl-2 mb-2 border-l-2 border-l-neutral">{ogTags.description}</p>
			{/if}
		</div>
	</div>
</a>
