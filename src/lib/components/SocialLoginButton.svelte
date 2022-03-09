<script lang="ts">
	import Fa from 'svelte-fa';
	import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
	export let provider: 'github' | 'google';

	const socialMap = {
		github: {
			name: 'Github',
			bgColor: 'bg-black',
			icon: faGithub,
			iconColor: 'white',
			textColor: 'text-white'
		},
		google: {
			name: 'Google',
			bgColor: 'bg-white',
			icon: faGoogle,
			iconColor: 'black',
			textColor: 'text-black'
		}
	};
</script>

<button type="submit" class={`btn btn-ghost flex flex-row shadow-lg ${socialMap[provider].bgColor} ${socialMap[provider].textColor} ${$$props.class}`}
	><Fa class="ml-2 mr-4" size="lg" icon={socialMap[provider].icon} color={socialMap[provider].iconColor} /> Login with {socialMap[
		provider
	].name}</button
>
