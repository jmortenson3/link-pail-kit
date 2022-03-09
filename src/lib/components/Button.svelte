<script lang="ts">
  export let click: any;
  export let disabled: boolean = false;
</script>

<button type="button" on:click|stopPropagation={click} {disabled} class={`btn ${$$props.class}`}>
  <slot />
</button>