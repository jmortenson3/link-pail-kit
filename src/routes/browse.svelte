<script lang="ts" context="module">

export const load: Load = async ({ session }) => {
  const {data, error} = await supabase.from('howdy').select('*');

  if (error) {
    console.log(error);
  }

  return {
    props: {
      data
    }
  }
}

</script>

<script lang="ts">
import PageTitle from "$lib/components/PageTitle.svelte";
import { supabase } from "$lib/supabase";
import type { Load } from "@sveltejs/kit";

export let data: any[] = [];
</script>

<PageTitle>Browse collections</PageTitle>

<pre>{JSON.stringify(data)}</pre>