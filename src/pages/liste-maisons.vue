<script setup lang="ts">
import FicheOffreMaison from "../components/FicheOffreMaison.vue";
import { supabase } from "../supabase";
import { SchemaOffreMaison } from "../types";

const { data, error } = await supabase
  .from<SchemaOffreMaison>("OffreMaison")
  .select("*");
// let { data: maisons, error } = await supabase
//   .rpc('toutes_les_offres')
const maisons = data;

if (error)
  console.error("erreur au chargement de la liste des offres :", error);
</script>

<template>
  <div class="p-2">
    <div v-for="maison in maisons" :key="maison.id" class="relative group">
      <button
        @click="
          $router.push({ name: 'edit-maison-id', params: { id: maison.id } })
        "
        class="hidden group-hover:block absolute top-0 right-0 p-1 border-double border-2"
      >
        Editer offre
      </button>
      <FicheOffreMaison v-bind="maison" />
    </div>
  </div>
</template>
