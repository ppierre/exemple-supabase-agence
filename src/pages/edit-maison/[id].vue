<script setup lang="ts">
import { supabase } from "../../supabase";
import { SchemaOffreMaison } from "../../types";
import FormkitOffreMaison from "../../components/FormkitOffreMaison.vue";
const props = defineProps<{ id: string }>();
const { data, error } = await supabase
  .from<SchemaOffreMaison>("OffreMaison")
  .select()
  .eq("id", props.id)
  .single(); //ne retourne qu'un résultat
</script>

<template>
  <FormkitOffreMaison :offreMaison="data" />
</template>
