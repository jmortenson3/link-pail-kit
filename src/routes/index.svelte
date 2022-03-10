<script>
import { session } from '$app/stores';

	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
</script>

<PageTitle>LinkBox</PageTitle>
<ButtonLink href="/login">Login</ButtonLink>

<p>{$session.user.email}</p>
