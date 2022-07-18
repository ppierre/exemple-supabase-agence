<script setup lang="ts">
import { supabase } from "../../supabase";
import { SchemaOffreMaison } from "../../types";
import FormKitOffreMaison from "../../components/FormKitOffreMaison.vue";
const props = defineProps<{ id: string }>();
const { data, error } = await supabase
  .from<SchemaOffreMaison>("OffreMaison")
  .select()
  .eq("id", props.id)
  .single(); //ne retourne qu'un résultat
</script>

<template>
  <FormKitOffreMaison :offreMaison="data" />
</template>
