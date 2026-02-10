<script setup lang="ts">
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import Sidebar from "../components/Sidebar.vue";
</script>

<template>
  <main class="flex flex-col w-full">
    <Header />
    <Sidebar class="self-end" />
    <Footer class="" />
  </main>
</template>
