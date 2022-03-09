<script lang="ts">
  export let href: string;
</script>

<a {href} class={`btn btn-link ${$$props.class}`}>
  <slot />
</a>
