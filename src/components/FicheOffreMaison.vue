<template>
  <figure>
    <ImgS
      v-if="image_name"
      class="rounded-t-lg w-full h-48 object-cover"
      bucket="images-maisons"
      public
      :name="image_name"
    />
    <img
      v-else
      class="rounded-t-lg w-full h-48 object-cover"
      :src="image"
      alt=""
    />
    <figcaption
      class="relative flex flex-col border-2 border-t-0 rounded-b-lg px-5 py-7 border-indigo-100"
    >
      <div
        class="w-12 h-12 grid place-items-center border-2 border-indigo-100 rounded-full absolute top-7 right-5"
      >
        <heart :class="{ 'fill-red-300': favori }" />
      </div>
      <h3 class="text-2xl text-gray-900">{{ nom }}</h3>
      <AddressRdf class="not-italic text-gray-500" :addr="adresse" short />
      <div class="flex items-center order-first">
        <div class="text-2xl font-bold text-indigo-500 pr-1">${{ prix }}</div>
        <div>/ months</div>
      </div>
      <hr class="border-indigo-100 border-t-2 my-4" />
      <div class="flex justify-between text-sm text-gray-500">
        <div><bed class="inline-block pr-1" />{{ nbrLits }}&nbsp;Beds</div>
        <div><bath class="inline-block pr-1" />{{ nbrSDB }} Bathrooms</div>
        <div><size class="inline-block pr-1" />{{ surface }}</div>
      </div>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import type { SchemaOffreMaison } from "../types";
import bed from "./icones/bed.vue";
import bath from "./icones/bath.vue";
import size from "./icones/size.vue";
import heart from "./icones/heart.vue";
import AddressRdf from "./AddressRdf.vue";
import ImgS from "./ImgS.vue";
defineProps<SchemaOffreMaison>();
</script>
