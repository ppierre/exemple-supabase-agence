<script setup lang="ts">
/* Ancienne version du code du formulaire sans FormKit */
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
    <form @submit.prevent class="grid grid-cols-1 gap-2">
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
      <label class="block">
        <span class="text-gray-700">Nom</span>
        <input
          v-model="offre.nom"
          type="text"
          placeholder=""
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-style"
        />
      </label>
      <label class="block">
        <span class="text-gray-700">prix</span>
        <input
          v-model="offre.prix"
          type="number"
          placeholder=""
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-style"
        />
      </label>
      <label class="block">
        <input
          v-model="offre.favori"
          :value="true"
          type="checkbox"
          placeholder=""
          class="mr-1 rounded-md border-gray-300 shadow-sm focus-style"
        />
        <span class="text-gray-700">Favoris</span>
      </label>
      <label class="block">
        <span class="text-gray-700">Nombre de chambre à coucher</span>
        <input
          v-model="offre.nbrLits"
          type="number"
          placeholder=""
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-style"
        />
      </label>
      <label class="block">
        <span class="text-gray-700">Nombre de salle de bain</span>
        <input
          v-model="offre.nbrSDB"
          type="number"
          placeholder=""
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-style"
        />
      </label>
      <label class="block">
        <span class="text-gray-700">Surface habitable</span>
        <input
          v-model="offre.surface"
          type="text"
          placeholder=""
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-style"
        />
      </label>
      <fieldset class="rounded-md border-gray-300 border-2 p-2">
        <legend>Adresse</legend>
        <label class="block">
          <span class="text-gray-700">Pays</span>
          <input
            v-model="offre.adresse.addressCountry"
            type="text"
            placeholder=""
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-style"
          />
        </label>
        <label class="block">
          <span class="text-gray-700">Localité</span>
          <input
            v-model="offre.adresse.addressLocality"
            type="text"
            placeholder=""
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-style"
          />
        </label>
        <label class="block">
          <span class="text-gray-700">Région</span>
          <input
            v-model="offre.adresse.addressRegion"
            type="text"
            placeholder=""
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-style"
          />
        </label>
        <label class="block">
          <span class="text-gray-700">Boite postal</span>
          <input
            v-model="offre.adresse.postOfficeBoxNumber"
            type="text"
            placeholder=""
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-style"
          />
        </label>
        <label class="block">
          <span class="text-gray-700">Code postal</span>
          <input
            v-model="offre.adresse.postalCode"
            type="text"
            placeholder=""
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-style"
          />
        </label>
        <label class="block">
          <span class="text-gray-700">N° et nom de rue</span>
          <input
            v-model="offre.adresse.streetAddress"
            type="text"
            placeholder=""
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-style"
          />
        </label>
      </fieldset>
      <button
        @click="posteOffreMaison()"
        class="rounded-md shadow-sm focus-style p-2 bg-blue-300 justify-self-end"
      >
        {{ offre.id ? "Mettre à jour offre" : "Créer nouvelle offre" }}
      </button>
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
    </form>
  </div>
</template>
