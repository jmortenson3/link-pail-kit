<script lang="ts">
  export let name: string;
  /**
   * NOTE: remember to bind:value when using this prop.
   */
  export let value: any;
  export let disabled: boolean = false;
</script>

<input class={`input text-base-content ${$$props.class}`} type="password" {name} bind:value {disabled} placeholder="**********" />
