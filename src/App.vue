<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="container">
    <div class="card shadow my-4">
      <div class="card-body">
        <div class="row">
          <div class="col-12 col-lg-6 mx-auto">
            <img class="w-100" src="./assets/images/LogoPUCESD.png" alt="">
          </div>
        </div>
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
