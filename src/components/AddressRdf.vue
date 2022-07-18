<template>
  <address vocab="https://schema.org/" typeof="PostalAddress">
    <span property="postalCode" v-text="addr.postalCode + ' '" />
    <span
      v-if="!short"
      property="postOfficeBoxNumber"
      v-text="addr.postOfficeBoxNumber + ' '"
    />
    <span property="streetAddress" v-text="addr.streetAddress + ' '" />
    <span property="addressLocality" v-text="addr.addressLocality + ' '" />,
    <span property="addressRegion" v-text="addr.addressRegion + ' '" />
  </address>
</template>
<script setup lang="ts">
import { PostalAddress } from "../types";
interface props {
  addr: PostalAddress;
  short: boolean;
}
defineProps<props>();
</script>
