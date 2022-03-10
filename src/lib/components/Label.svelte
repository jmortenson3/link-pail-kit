<script lang="ts">
  export let forName: string = '';
</script>

<label class={`label text-base-content ${$$props.class}`} for={forName}><slot /></label>
