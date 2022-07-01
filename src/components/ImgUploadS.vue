<script setup lang="ts">
import { ref } from "vue";
import { supabase } from "../supabase";
import ImgS from "./ImgS.vue";

const props = defineProps({
  context: Object,
});

const image_name = ref<string>(props.context._value);

async function supprimeImage() {
  const { data, error } = await supabase.storage
    .from("prive-images-maisons")
    .remove([image_name.value]);
  if (error) {
    console.error(
      "Impossible de supprimer l'image : ",
      image_name.value,
      " raison : ",
      error
    );
  } else {
    image_name.value = null;
  }
}
async function ajouterImage(evt) {
  const file = evt.target.children.fichier.files[0];
  const { data, error } = await supabase.storage
    .from("prive-images-maisons")
    .upload(file.name, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) {
    console.error("Impossible d'uploader :", error);
  } else {
    image_name.value = file.name;
    props.context.node.input(image_name.value);
  }
}
</script>

<template>
  <div v-if="image_name">
    <ImgS
      class="rounded-t-lg w-full h-48 object-cover"
      bucket="prive-images-maisons"
      :name="image_name"
    />
    <button
      class="bg-red-500 rounded-lg p-2 mt-2 ml-auto block"
      @click="supprimeImage()"
    >
      Supprimer l'image
    </button>
  </div>
  <div v-else>
    <form @submit.prevent="ajouterImage">
      <input type="file" name="fichier" />
      <button
        type="submit"
        class="bg-green-500 rounded-lg p-2 mt-2 ml-auto block"
      >
        Ajouter l'image
      </button>
    </form>
  </div>
</template>
