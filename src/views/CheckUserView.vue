<template>
    <div class="row mt-5">
        <div class="col-12 order-md-1 col-lg-9 mx-auto mb-4 text-justify">
            <p>Bienvenido al sistema de reservas de citas médicas de la PUCESD, le recordamos que para hacer uso
                de este servicio debe pertenecer a la comunidad universitaria ya sea como docente, estudiante o
                administrativo, para continuar por favor ingresa los siguientes datos:</p>
            <o-field label="Cédula:">
                <o-input v-model="dni" />
            </o-field>
            <o-button @click="checkUser()" variant="primary">VERFICAR</o-button>
        </div>
        <div class="col-6 col-md-2 order-md-12 mx-auto mx-0">
            <img id="medical-logo" class="w-100" src="../assets/images/medical-logo-heart.png" alt="">
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMainStore } from '../stores/mainStore';
import { useRouter } from 'vue-router';

const store = useMainStore();
const router = useRouter();

const dni = ref("");

async function checkUser() {
    const result = await store.checkUser(dni);
    if (result) {
        router.replace("/agenda")
    }
}

</script>

<style></style>