<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase";
import { PartialSchemaOffreMaison, SchemaOffreMaison } from "../types";
import ImgS from "./ImgS.vue";
const props = defineProps<{ offreMaison?: SchemaOffreMaison }>();
const router = useRouter();

const offre = reactive<PartialSchemaOffreMaison>(
  props.offreMaison ?? { adresse: {} }
);

async function posteOffreMaison() {
  const { data, error } = await supabase
    .from<PartialSchemaOffreMaison>("OffreMaison")
    .upsert(offre);
  if (error) {
    console.error(
      "Impossible de mettre à jour l'offre : ",
      offre,
      " erreur : ",
      error
    );
  } else {
    router.push({ name: "edit-maison-id", params: { id: data[0].id } });
  }
}
async function supprimerOffre() {
  console.log("Dans suppression offre");
  const { data, error } = await supabase
    .from<SchemaOffreMaison>("OffreMaison")
    .delete()
    .match({ id: offre.id });
  if (error) {
    console.error("Erreur à la suppression de ", offre, "erreur :", error);
  } else {
    router.push("/edit-maison/new");
  }
}
async function supprimeImage() {
  const { data, error } = await supabase.storage
    .from("prive-images-maisons")
    .remove([offre.image_name]);
  if (error) {
    console.error(
      "Impossible de supprimer l'image : ",
      offre.image_name,
      " raison : ",
      error
    );
  } else {
    offre.image_name = null;
    if (!offre.id) return; // pas d'offre à mettre à jour
    const { data, error } = await supabase
      .from("OffreMaison")
      .update({ image_name: null })
      .match({ id: offre.id });
    if (error) {
      console.error(
        "erreur lors de la suppression de l'image de l'offre :",
        offre.id,
        "erreur :",
        error
      );
    }
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
    offre.image_name = file.name;
    if (!offre.id) return; // pas d'offre à mettre à jour
    const { data, error } = await supabase
      .from("OffreMaison")
      .update({ image_name: file.name })
      .match({ id: offre.id });
    if (error) {
      console.error(
        "erreur lors de la mise à jour de l'image de l'offre :",
        offre.id,
        "erreur :",
        error
      );
    }
  }
}
</script>

<template>
  <div>
    <!-- TODO: les classes mises à FormKit ne fct pas ! -->
    <FormKit
      type="form"
      v-model="offre"
      :submit-label="offre.id ? 'Mettre à jour offre' : 'Créer nouvelle offre'"
      @submit="posteOffreMaison"
      :config="{
        classes: {
          form: '$reset grid grid-cols-1 gap-2',
          label: 'text-gray-700',
          input:
            'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-style',
          actions: 'justify-self-end',
        },
      }"
      :submit-attrs="{
        inputClass: 'rounded-md shadow-sm focus-style p-2 bg-blue-300 ',
        wrapperClass: '',
        outerClass: '',
      }"
    >
      <!-- <button
        class="rounded-md shadow-sm focus-style p-2 bg-blue-300 justify-self-end"
      >
        submit replacé par option sur FormKit
      </button> -->
      <input type="hidden" v-model="offre.id" />
      <div v-if="offre.image_name">
        <ImgS
          class="rounded-t-lg w-full h-48 object-cover"
          bucket="prive-images-maisons"
          :name="offre.image_name"
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
      <FormKit name="nom" label="Nom" />
      <FormKit type="number" name="prix" label="Prix" />
      <FormKit
        type="checkbox"
        name="favori"
        label="Favori"
        input-class="w-4"
        inner-class="inline-block"
        label-class="inline-block"
      />
      <FormKit
        type="number"
        name="nbrLits"
        label="Nombre de chambre à coucher"
      />
      <FormKit type="number" name="nbrSDB" label="Nombre de salle de bain" />
      <FormKit name="surface" label="Surface habitable" />
      <fieldset class="rounded-md border-gray-300 border-2 p-2">
        <legend>Adresse</legend>
        <FormKit type="group" name="adresse">
          <FormKit name="addressCountry" label="Pays" />
          <FormKit name="addressLocality" label="Localité" />
          <FormKit name="addressRegion" label="Région" />
          <FormKit name="postOfficeBoxNumber" label="Boite postal" />
          <FormKit name="postalCode" label="Code postal" />
          <FormKit name="streetAddress" label="N° et nom de rue" />
        </FormKit>
      </fieldset>

      <button
        type="button"
        v-if="offre.id"
        @click="($refs.dialogSupprimer as any).showModal()"
        class="rounded-md shadow-sm focus-style p-2 bg-red-500 justify-self-end"
      >
        Supprimer l'offre
      </button>
      <dialog
        ref="dialogSupprimer"
        @click="($event.currentTarget as any).close()"
      >
        <button
          class="rounded-md shadow-sm focus-style p-2 bg-blue-300 justify-self-end"
        >
          Annuler</button
        ><button
          @click="supprimerOffre()"
          class="rounded-md shadow-sm focus-style p-2 bg-red-500"
        >
          Confirmer suppression
        </button>
      </dialog>
    </FormKit>
  </div>
</template>
