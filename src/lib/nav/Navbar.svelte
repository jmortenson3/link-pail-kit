<script lang="ts">
	import { session } from '$app/stores';
	import { supabase } from '../supabase';

	const logout = async () => {
		const {error} = await supabase.auth.signOut();
		if (error) {
			console.log(error);
		}
	};
</script>

<div class="navbar border-b-base-300">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-xl">Linkbox 🥡</a>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal p-0">
			<li><a href="/browse">Browse</a></li>
			{#if $session.user}
				<li><a href="/collections">My Collections</a></li>
			{:else}
				<li><a href="/login">Signup</a></li>
				<li><a href="/login">Login</a></li>
			{/if}
		</ul>

		{#if $session.user?.user_profile}
			<div class="dropdown dropdown-end">
				<div tabindex="0" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						<img src={$session.user.user_profile.avatar_url} alt="your avatar" />
					</div>
				</div>
				<ul
					tabindex="0"
					class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
				>
					<li>
						{#if $session.user.user_profile.username != null}
							<li>{$session.user.user_profile.username}</li>
						{/if}
						<a href="/profile" class="justify-between"> Profile </a>
					</li>
					<li><a href="/settings">Settings</a></li>
					<li><button on:click={logout}>Logout</button></li>
				</ul>
			</div>
		{/if}
	</div>
</div>
