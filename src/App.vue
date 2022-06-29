<template>
  <pre v-if="user">eMail : {{ user.email }}</pre>
  <div v-else>Pas de user</div>
  <ul>
    <li>
      <routerLink to="/">Accueil</routerLink>
    </li>
    <li>
      <routerLink to="/liste-maisons">liste maisons</routerLink>
    </li>
    <li>
      <routerLink to="/login-logout">Login/out</routerLink>
    </li>
    <li>
      <routerLink to="/edit-maison/new"> Ajout Offre</routerLink>
    </li>
  </ul>
  <div class="p-2">
    <Suspense>
      <routerView />
      <template #fallback> Chargement... depuis "routerview..." </template>
    </Suspense>
  </div>
</template>
<script setup lang="ts">
import { user } from "./supabase";
</script>
