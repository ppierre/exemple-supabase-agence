<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase";
import { PartialSchemaOffreMaison, SchemaOffreMaison } from "../types";
import { createInput } from "@formkit/vue";
import ImgUploadS from "./ImgUploadS.vue";
const props = defineProps<{ offreMaison?: SchemaOffreMaison }>();
const router = useRouter();

const offre = ref<PartialSchemaOffreMaison>(
  props.offreMaison ?? { adresse: {} }
);

async function posteOffreMaison() {
  const { data, error } = await supabase
    .from<PartialSchemaOffreMaison>("OffreMaison")
    .upsert(offre.value);
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
    .match({ id: offre.value.id });
  if (error) {
    console.error("Erreur à la suppression de ", offre, "erreur :", error);
  } else {
    router.push("/edit-maison/new");
  }
}
const imgUploadSupabase = createInput(ImgUploadS);
</script>

<template>
  <div>
    <FormKit
      id="form"
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
      <FormKit type="hidden" name="id" />
      <FormKit :type="imgUploadSupabase" name="image_name" />
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
        @click="$formkit.reset('form')"
        class="rounded-md shadow-sm focus-style p-2 bg-green-300 justify-self-end"
      >
        Reset
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
          type="button"
          class="rounded-md shadow-sm focus-style p-2 bg-blue-300 justify-self-end"
        >
          Annuler</button
        ><button
          type="button"
          @click="supprimerOffre()"
          class="rounded-md shadow-sm focus-style p-2 bg-red-500"
        >
          Confirmer suppression
        </button>
      </dialog>
    </FormKit>
  </div>
</template>
